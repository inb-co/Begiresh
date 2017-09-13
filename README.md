# Begiresh

Begiresh is a lightweight none-jQuery,  smart application banner targeting major Iranian android markets. A live [demo](http://roozame.com/) can be seen at [roozame.com](http://roozame.com/).

For having more information, demo and how-to instructions, visit [inb-co.github.io/Begiresh](https://inb-co.github.io/Begiresh) (currently only Farsi).

This project was inspired by [jquery.smartbanner](https://github.com/jasny/jquery.smartbanner).

## Installation
### Yarn
`$ yarn add begiresh`

### NPM
`$ npm install --save begiresh`

### CDN
`https://unpkg.com/begiresh/dist/begiresh.js`

`https://unpkg.com/begiresh/dist/begiresh.css`


## Usage
1. Add Meta and `Begiresh.css` to `<head>` of your HTML:
```html
  <head>

    <title>Roozame.com</title>

    <meta name="cafe-bazaar-app" content="app-id=com.inb.roozame"> <!-- And/Or -->
    <meta name="google-play-app" content="app-id=com.inb.roozame">

    <link rel="android-touch-icon" href="roozame-android-icon.png"> <!-- And/Or -->
    <link rel="apple-touch-icon" href="roozame-apple-touch-icon.png"> <!-- And/Or -->
    <link rel="apple-touch-icon-precomposed" href="roozame-apple-touch-icon-precomposed.png">

    <link rel="stylesheet" href="path/to/begiresh.css" media="screen" title="Begiresh Smart Banner CSS">

    <!-- Other Stuff Here -->
  </head>
```

1. Add `Begiresh.js` to `<body>` of your HTML:
```html
  <body>

    <!-- Other Stuff Here -->

    <script src="path/to/begiresh.js"></script>
  </body>
```

1. Create a new banner from your JS:
```javascript
  new Begiresh({
    title: 'روزامه Roozame',
    author: 'ایده نگاران بینا'
  });
```

## Options
you can use these options for having a customized smart banner:

| Option | Default Value | Type | Description | Required |
| ------ | ------------- | ---- | ----------- | -------- |
| `title` | `none` | string | Title of app | Yep |
| `author` | `none` | string | Author of app | Yep |
| `price` | `رایگان` | string | Price of app | Nop |
| `icon` | Site's Favicon | string | Address to app's icon | Nop |
| `daysHidden` | `15` | number | Number of days banner hides after dismiss | Nop |
| `daysReminder` | `90` | number | Number of days banner hides after download | Nop |
| `storeLang` | User's Language | string | User and store's language (on ISO Language Codes) | Nop |
| `store` | `googlePlay` | string | Store's ID | Nop |
| `button` | `بگیرش` | string | Text on download button | Nop |
| `theme` | `default` | string | Begiresh Theme | Nop |
| `force` | `false` | boolean | Force to have banner on every platform and ignoring cookies | Nop |
| `onDownload` | `none` | function | run a function after download | Nop |
| `onClose` | `none` | function | run a function after dismiss | Nop |

These stores are currently supported:

|  Name  | ID on Instance | ID on Meta |
| ------ | ------ | ------ |
| Googel Play (گوگل‌پلی) | googlePlay | google-play-app |
| Cafe Bazaar (کافه‌بازار) | cafeBazaar | cafe-bazaar-app |

## Development
To customize and develop the project you could use following npm commands:

#### To build whole project
```bash
  npm run build
```

#### To bundle and minify JS
```bash
  npm run build-js
```

#### To transpile LESS and parse CSS
```bash
  npm run build-css
```

## License
Begiresh is a free and open project developed and maintained by [Javid Izadfar](https://github.com/Javid-Izadfar) at [INB Co.](http://inb-co.com), published under MIT license.
