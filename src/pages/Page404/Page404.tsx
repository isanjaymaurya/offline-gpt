import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router";
import Button from "../../components/UI/Button/Button";
import BaseLayout from "../../components/Layout/BaseLayout/BaseLayout";
import styles from "./Page404.module.scss";

const Page404: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>404 - Page Not Found</title>
                <meta name="description" content="The page you are looking for does not exist." />
            </Helmet>
            <BaseLayout>
                <div className={styles.container}>
                    <p className={styles.code}>404</p>
                    <h1 id="page-404-title" className={styles.title}>
                        Page not found
                    </h1>
                    <p className={styles.desc}>
                        The page you are looking for doesn't exist or has been moved. Check the URL
                        or go back to the homepage.
                    </p>
                    <Link to="/">
                        <Button>Go to homepage</Button>
                    </Link>
                </div>
            </BaseLayout>
        </>
    );
};

export default Page404;