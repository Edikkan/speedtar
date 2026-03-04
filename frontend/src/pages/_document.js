import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <meta name="application-name" content="Speedtar" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Speedtar" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#3b82f6" />
          <meta name="msapplication-tap-highlight" content="no" />
          
          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Speedtar - Modern E-commerce" />
          <meta property="og:description" content="Shop the latest products at Speedtar. Fast shipping, great prices, excellent service." />
          <meta property="og:site_name" content="Speedtar" />
          <meta property="og:url" content="https://shop.hitension.live" />
          <meta property="og:image" content="https://shop.hitension.live/og-image.jpg" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Speedtar - Modern E-commerce" />
          <meta name="twitter:description" content="Shop the latest products at Speedtar. Fast shipping, great prices, excellent service." />
          <meta name="twitter:image" content="https://shop.hitension.live/twitter-image.jpg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
