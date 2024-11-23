import * as vue from '../vue.js'

describe('vue matcher', () => {
  it.each([
    ['<script></script>', 'js'],
    ['<script setup></script>', 'js'],
    ['<script lang="js"></script>', 'js'],
    ['<script setup lang="js"></script>', 'js'],
    ['<script lang="ts"></script>', 'ts'],
    ['<script setup lang="ts"></script>', 'ts'],
    ['', null],
  ])(
    "when script tag is '%s', should return %s",
    async (scriptTag, expected) => {
      const content = `<template></template>${scriptTag}<style></style>`

      const result = await vue.getVueSfcScriptType(content)

      expect(result).toBe(expected)
    },
  )
})
