"use client";
import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const STATUS_API = "/api/status";

function StatusIcon({ status }: { status: string }) {
  return status === "ok" ? (
    <CheckCircleIcon className="w-6 h-6 text-green-500" />
  ) : (
    <XCircleIcon className="w-6 h-6 text-red-500" />
  );
}

// Helper function to check if all systems are operational
function areAllSystemsOperational(status: any): boolean {
  let isOperational = true;
  if (!status) isOperational = false;
  
  // Check victoriametrics
  if (status.victoriametrics !== "ok") isOperational = false;
  
  // Check vmagent
  if (status.vmagent !== "ok") isOperational = false;
  
  // Check katpool-app
  if (status["katpool-app"]?.status !== "ok") isOperational = false;
  
  // Check go-app
  if (status["go-app"]?.status !== "ok") isOperational = false;
  
  // Check all services in go-app
  if (status["go-app"]?.services) {
    for (const serviceStatus of Object.values(status["go-app"].services)) {
      if (serviceStatus !== "ok") isOperational = false;
    }
  }

  return isOperational;
}



export default function StatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(STATUS_API)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load status");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-600 dark:text-gray-400">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const allOperational = areAllSystemsOperational(status);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {allOperational ? (
        <div className="rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700/60 flex items-center px-4 py-3 mb-8">
          <CheckCircleIcon className="w-7 h-7 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-lg font-semibold text-green-800 dark:text-green-200">All Systems Operational</span>
        </div>
      ) : (
        <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/60 flex items-center px-4 py-3 mb-8">
          <ExclamationTriangleIcon className="w-7 h-7 text-yellow-600 dark:text-yellow-400 mr-2" />
          <span className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            System Outage - Some systems are experiencing issues
          </span>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Current Status: Katpool</h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60 p-5 gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-800 dark:text-gray-100">VictoriaMetrics</div>
              <div className="relative flex items-center">
                <div className="group">
                  <button className="flex items-center justify-center w-5 h-5 rounded-full text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View information</span>
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 text-xs text-white p-3 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -top-[6px]"></div>
                      <div className="font-medium mb-1"><strong>VictoriaMetrics</strong></div>
                      <p className="mb-2">Time series database that stores monitoring data and metrics from the mining pool infrastructure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <StatusIcon status={status.victoriametrics} />
          </div>
        </div>
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60 p-5 gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-800 dark:text-gray-100">VMAgent</div>
              <div className="relative flex items-center">
                <div className="group">
                  <button className="flex items-center justify-center w-5 h-5 rounded-full text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View information</span>
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 text-xs text-white p-3 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -top-[6px]"></div>
                      <div className="font-medium mb-1"><strong>VMAgent</strong></div>
                      <p className="mb-2">Data collection agent that scrapes metrics from various services and sends them to VictoriaMetrics for storage.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <StatusIcon status={status.vmagent} />
          </div>
        </div>
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60 p-5 gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-800 dark:text-gray-100">Katpool App</div>
              <div className="relative flex items-center">
                <div className="group">
                  <button className="flex items-center justify-center w-5 h-5 rounded-full text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View information</span>
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 text-xs text-white p-3 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -top-[6px]"></div>
                      <div className="font-medium mb-1"><strong>Katpool App</strong></div>
                      <p className="mb-2">Main mining pool application that handles stratum connections, block submission, and payout processing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <StatusIcon status={status["katpool-app"]?.status || "error"} />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Active Ports: {status["katpool-app"]?.activePorts?.join(", ") || "None"}</div>
          <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">All Ports:</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(status["katpool-app"]?.allPorts || {}).map(([port, state]) => (
              <span
                key={port}
                className={`px-2 py-0.5 rounded text-xs font-mono ${state === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400"}`}
              >
                {port}: {String(state)}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60 p-5 gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-800 dark:text-gray-100">Go App</div>
              <div className="relative flex items-center">
                <div className="group">
                  <button className="flex items-center justify-center w-5 h-5 rounded-full text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View information</span>
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 text-xs text-white p-3 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -top-[6px]"></div>
                      <div className="font-medium mb-1"><strong>Go App</strong></div>
                      <p className="mb-2">Go-based backend services that fetch blocks from the Kaspa network and send them to the mining pool for distribution to miners.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <StatusIcon status={status["go-app"]?.status || "error"} />
          </div>
          <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">Services:</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(status["go-app"]?.services || {}).map(([service, state]) => (
              <span
                key={service}
                className={`px-2 py-0.5 rounded text-xs font-mono ${state === "ok" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400"}`}
              >
                {service}: {String(state)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 