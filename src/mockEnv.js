// src/mockEnv.js
import { mockTelegramEnv } from '@tma.js/sdk'

if (import.meta.env.DEV) {
  mockTelegramEnv({
    initData: {
      user: {
        id: 123456789,
        first_name: 'Иван',
        last_name: 'Иванов',
        username: 'ivan_test',
        language_code: 'ru',
      },
    },
    version: '7.0',
    platform: 'tdesktop',
  })
}