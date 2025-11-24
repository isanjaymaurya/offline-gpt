import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ChatConvoType, ChatRecordType, NewChatRecordType } from "../global";

export function useIndexDb(dbName: string, storeName: string) {
    const dbRef = useRef<IDBDatabase | null>(null);
    const [isDBReady, setisDBReady] = useState(false);

    useEffect(() => {
        const req = window.indexedDB.open(dbName, 1);

        req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            const database = (e.target as IDBOpenDBRequest).result;
            if (!database.objectStoreNames.contains(storeName)) {
                database.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
            }
        };

        req.onsuccess = (e: Event) => {
            const database = (e.target as IDBOpenDBRequest).result;
            dbRef.current = database;
            setisDBReady(true);

            database.onversionchange = () => {
                database.close();
                dbRef.current = null;
                setisDBReady(false);
                console.warn("IndexedDB closed due to version change.");
            };
        };

        req.onerror = (e: Event) => {
            console.error("IndexedDB open error:", (e.target as IDBOpenDBRequest).error);
            setisDBReady(false);
        };

        req.onblocked = () => {
            console.warn("IndexedDB open blocked. Close other connections to proceed.");
        };

        const handleUnload = () => {
            if (dbRef.current) {
                dbRef.current.close();
                dbRef.current = null;
                setisDBReady(false);
            }
        };
        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
            if (dbRef.current) {
                dbRef.current.close();
                dbRef.current = null;
            }
            setisDBReady(false);
        };
    }, [dbName, storeName]);

    // helper: wait for db ready with small timeout
    const waitForDb = useCallback((timeout = 2000): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            (function check() {
                if (dbRef.current) return resolve(dbRef.current);
                if (Date.now() - start > timeout) return reject(new Error("IndexedDB not ready"));
                setTimeout(check, 50);
            })();
        });
    }, []);

    const addRecord = useCallback((data: NewChatRecordType): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = dbRef.current ?? (await waitForDb());
                const tx = database.transaction(storeName, "readwrite");
                const store = tx.objectStore(storeName);
                const id = (crypto as any)?.randomUUID ? (crypto as any).randomUUID() : uuidv4();
                const record = { ...data, id };
                // use put to allow upsert (safer than add)
                const request = store.put(record as any);

                request.onsuccess = (e) => {
                    // return the key (could be string or number)
                    resolve((e.target as IDBRequest).result as string);
                };
                request.onerror = (e) => {
                    reject((e.target as IDBRequest).error ?? new Error("Add record failed"));
                };
                tx.onerror = (e) => {
                    console.error("Transaction error on addRecord:", (e as any).target?.error);
                };
            } catch (err) {
                reject(err);
            }
        });
    }, [storeName, waitForDb]);

    const updateRecord = useCallback(
        (id: string, newConvo: ChatConvoType[]): Promise<ChatConvoType[]> => {
            return new Promise(async (resolve, reject) => {
                try {
                    const database = dbRef.current ?? (await waitForDb());
                    const tx = database.transaction(storeName, "readwrite");
                    const store = tx.objectStore(storeName);

                    let updatedConvo: ChatConvoType[] = [];

                    const toAppend = Array.isArray(newConvo) ? newConvo : [newConvo];

                    const getRequest = store.get(id as IDBValidKey);
                    getRequest.onsuccess = () => {
                        const record: ChatRecordType | undefined = getRequest.result;
                        if (!record) {
                            return reject(new Error("Record not found for update"));
                        }

                        const oldConvo: ChatConvoType[] = Array.isArray(record.convo) ? record.convo : [];
                        updatedConvo = [...oldConvo, ...toAppend];

                        const newRecord: ChatRecordType = {
                            ...record,
                            convo: updatedConvo,
                            updatedAt: Date.now(),
                        };
                        const putRequest = store.put(newRecord);
                        putRequest.onerror = (e) =>
                            reject((e.target as IDBRequest).error ?? new Error("Update record failed"));
                    };

                    getRequest.onerror = (e) =>
                        reject((e.target as IDBRequest).error ?? new Error("Get record for update failed"));

                    tx.oncomplete = () => resolve(updatedConvo);
                    tx.onabort = tx.onerror = (e: any) =>
                        reject(e?.target?.error ?? new Error("Transaction failed during update"));
                } catch (err) {
                    reject(err);
                }
            });
        },
        [storeName, waitForDb]
    );

    const getChatRecord = useCallback((chatId: string): Promise<ChatRecordType | undefined> => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = dbRef.current ?? (await waitForDb());
                const tx = database.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);

                // try exact key first
                const tryGet = (key: string) => {
                    return new Promise<ChatRecordType | undefined>((res, rej) => {
                        const request = store.get(key as IDBValidKey);
                        request.onsuccess = () => res(request.result as ChatRecordType | undefined);
                        request.onerror = (e) => rej((e.target as IDBRequest).error ?? new Error("Get record failed"));
                    });
                };

                let result = await tryGet(chatId as any);
                // if not found and chatId is string that looks like number, try numeric key
                if (result === undefined && typeof chatId === "string" && /^\d+$/.test(chatId)) {
                    result = await tryGet(chatId);
                }
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }, [storeName, waitForDb]);

    const getAllRecord = useCallback((): Promise<ChatRecordType[]> => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = dbRef.current ?? (await waitForDb());
                const tx = database.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);
                const request = store.getAll();

                request.onsuccess = () => resolve(request.result as ChatRecordType[]);
                request.onerror = (e) => reject((e.target as IDBRequest).error ?? new Error("Get all failed"));
            } catch (err) {
                reject(err);
            }
        });
    }, [storeName, waitForDb]);

    const deleteRecord = useCallback((id: string): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = dbRef.current ?? (await waitForDb());
                const tx = database.transaction(storeName, "readwrite");
                const store = tx.objectStore(storeName);
                const request = store.delete(id as IDBValidKey);

                request.onsuccess = () => resolve();
                request.onerror = (e) => reject((e.target as IDBRequest).error ?? new Error("Delete failed"));
            } catch (err) {
                reject(err);
            }
        });
    }, [storeName, waitForDb]);

    return useMemo(() => ({
        addRecord,
        updateRecord,
        getChatRecord,
        getAllRecord,
        deleteRecord,
        isDBReady
    }), [addRecord, getChatRecord, getAllRecord, deleteRecord, isDBReady]);
}
