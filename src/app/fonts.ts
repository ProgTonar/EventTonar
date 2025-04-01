import localFont from 'next/font/local'

// Загружаем шрифт GolosText из локальных файлов
export const golosText = localFont({
  src: [
    {
      path: '../../public/fonts/GolosText-Regular.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GolosText-Medium.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-golos-text', // CSS переменная для использования
}) 