import React, { useState } from "react";
import { parse } from "../utils/parse";

export function isNumeric(str) {
    if (typeof str !== "string") return false
    return !Number.isNaN(str) &&
      !Number.isNaN(parseFloat(str))
}

/**
 *
 * @param {{
 *  editable: boolean,
 *  className?: string,
 *  config: Object,
 *  configErrors?: Object,
 *  onConfigChange: () => void,
 * }} props
 * @returns
 */
function Source(props) {
    const { className, editable, config: initialConfig, onConfigChange } = props;
    const [config, setConfig] = useState(initialConfig);

    const {
        host,
        authorization,
        uri,
        cluster,
        database,
        search_path: searchPath,
    } = config;

    const buildHandleChange = (field) => {
        return (e) => {
            const { target } = e;
            const { value } = target;

            const newConfig = {
                ...config
            };

            /**
             * Handle authorization fields.
             */
            if (field === "user" || field === "password") {
                if (!authorization) {
                    newConfig.authorization = {
                        [field]: value
                    };
                } else {
                    newConfig.authorization = authorization;
                    newConfig.authorization[field] = value;
                }
            } else if (field === "uri") {
                if (value) {
                    newConfig.uri = value;

                    const escapedOutput = value.replace(/"/g, ''); // escape double quotes
                    const cleanOutput = escapedOutput.replace(/psql /, ''); // escape double quotes
                    const config = parse(cleanOutput);
                    const { user, password, host, database, search_path } = config;

                    if (user) {
                        newConfig.authorization = {
                            ...newConfig.authorization,
                            user,
                            password,
                        };
                    }

                    if (host) {
                        newConfig.host = host;
                    }

                    if (database) {
                        newConfig.database = database;
                    }

                    if (search_path) {
                        newConfig.search_path = search_path;
                    }
                } else {
                    newConfig.uri = "";
                }
            } else {
                /**
                 * Handle normal fields.
                 */
                newConfig[field] = value;
            }

            if (editable) {
                setConfig(newConfig);
            }
        }
    }

    const onContinueClick = () => {
        if (onConfigChange && editable) {
            onConfigChange(config);
        }
    };

    return (
        <div className={className}>
            {/**
             * Materialize URI
             */}
            <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Shortcut</p>
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Paste PSQL URI"
                        name="materialize_uri"
                        id="uri"
                        autoComplete="materialize_uri"
                        className={`p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-xs border border-gray-300 rounded-md`}
                        onChange={buildHandleChange("uri")}
                        value={uri}
                    />
                </div>
            </div>

             <div className="pt-4">
                {/**
                 * Materialize Host
                 */}
                <p className="block text-sm font-medium sm:mt-px sm:py-2">
                    Host
                </p>
                <div>
                    <input
                        type="text"
                        placeholder="Host"
                        name="materialize_host"
                        id="host"
                        autoComplete="materialize_host"
                        className={`p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-xs border border-gray-300 rounded-md`}
                        onChange={buildHandleChange("host")}
                        value={host}
                    />
                </div>

                {/* Authorizations */}
                <p className="block text-sm font-medium sm:mt-px sm:py-2">
                    Authorization
                </p>
                {/**
                 * Materialize User
                 */}
                <div>
                    <input
                        type="text"
                        placeholder="User"
                        name="materialize_user"
                        id="user"
                        autoComplete="materialize_user"
                        className={`p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-xs border border-gray-300 rounded-md`}
                        onChange={buildHandleChange("user")}
                        value={authorization && authorization.user}
                        readOnly={editable === false}
                    />
                </div>

                {/**
                 * Materialize Password
                 */}
                <div className="mt-2">
                    <input
                        type="password"
                        placeholder="Password"
                        name="materialize_password"
                        id="password"
                        autoComplete="materialize_password"
                        className={`p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-xs border border-gray-300 rounded-md`}
                        onChange={buildHandleChange("password")}
                        value={authorization && authorization.password}
                    />
                </div>

                {/* Optional */}
                <p className="block text-sm font-medium text-gray-400 sm:mt-px sm:py-2">
                    Optional
                </p>
                {/**
                 * Materialize Database
                 */}
                <div>
                    <input
                        type="text"
                        placeholder="Database"
                        name="materialize_database"
                        id="database"
                        autoComplete="materialize_database"
                        className={`p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-xs border border-gray-300 rounded-md`}
                        onChange={buildHandleChange("database")}
                        value={database}
                        readOnly={editable === false}
                    />
                </div>

                {/**
                 * Materialize Schema
                 */}
                <div className="mt-2">
                    <input
                        type="text"
                        placeholder="Search path"
                        name="materialize_search_path"
                        id="schema"
                        autoComplete="materialize_search_path"
                        className={`p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-xs border border-gray-300 rounded-md`}
                        onChange={buildHandleChange("search_path")}
                        value={searchPath}
                    />
                </div>

                {/**
                 * Materialize Cluster
                 */}
                <div className="mt-2">
                    <input
                        type="text"
                        placeholder="Cluster"
                        name="materialize_cluster"
                        id="cluster"
                        autoComplete="materialize_cluster"
                        className={`p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-xs border border-gray-300 rounded-md`}
                        onChange={buildHandleChange("cluster")}
                        value={cluster}
                    />
                </div>
            </div>

            <div className="mt-4">
                <button className="bg-purple-700 text-sm w-full rounded p-1 hover:bg-purple-500 text-white" onClick={onContinueClick}>
                    Continue
                </button>
            </div>
        </div >
    );
}

Source.defaultProps = {
    configErrors: {
        host: false,
        user: false,
        database: false,
        password: false,
        port: false,
    },
    config: {},
    className: "",
    onConfigChange: () => { },
}

export default Source;