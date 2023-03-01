import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import UnoCss from '@unocss/vite';
import { presetUno } from '@unocss/preset-uno';
import presetWebFonts from '@unocss/preset-web-fonts';

export default defineConfig({
  plugins: [
    solidPlugin(),
    UnoCss({
      presets: [
        // @ts-ignore
        presetUno(),
        // @ts-ignore
        presetWebFonts({
          provider: "google",
          fonts: {
            sans: "Nunito:200,300,400,500,600,700,800,900",
            roboto: "Roboto:100,300,400,500,700,900",
          }
        }),
      ]
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
