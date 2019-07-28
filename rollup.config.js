import builtins from 'rollup-plugin-node-builtins';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import ts from 'typescript';
import tempDir from 'temp-dir';

module.exports = [
    {
        input: {
            NodePluginManager: 'src/manager/NodePluginManager.ts',
        },
        output: {
            dir: 'dist',
            format: 'es',
            sourcemap: true
        },
        watch: {
            include: 'src/**',
        },
        external: [
            'path',
            'fs',
            'crypto'
        ],
        plugins: [
            peerDepsExternal(),
            eslint({
                include: [
                    'src/**/*.ts'
                ]
            }),
            typescript({
                typescript: ts,
                useTsconfigDeclarationDir: true,
                cacheRoot: `${tempDir}/.rpt2_cache`
            }),
            commonjs(),
            resolve(),
            cleanup({
                extensions: ['ts']
            })
        ]
    },
    {
        input: {
            BrowserPluginManager: 'src/manager/BrowserPluginManager.ts'
        },
        output: {
            dir: 'dist',
            format: 'es',
            sourcemap: true
        },
        watch: {
            include: 'src/**',
        },
        plugins: [
            eslint({
                include: [
                    'src/**/*.ts'
                ]
            }),
            typescript({
                typescript: ts,
                useTsconfigDeclarationDir: true,
                cacheRoot: `${tempDir}/.rpt2_cache`
            }),
            commonjs(),
            builtins(),
            resolve({
                browser: true,
                preferBuiltins: false
            }),
            cleanup({
                extensions: ['ts']
            })
        ]
    }
];
