import builtins from 'rollup-plugin-node-builtins';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import globals from 'rollup-plugin-node-globals';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import ts from 'typescript';
import tempDir from 'temp-dir';

module.exports = [
    {
        input: {
            node: 'src/index.ts'
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
            'crypto',
            'fs',
            'os',
            'path',
            'tty',
            'util'
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
            resolve({
                preferBuiltins: true
            }),
            cleanup({
                extensions: ['ts']
            })
        ]
    },
    {
        input: {
            browser: 'src/index.ts'
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
            globals(),
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
