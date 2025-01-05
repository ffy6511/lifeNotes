declare namespace MathJax {
  const tex: {
    inlineMath: [string, string][];
    displayMath: [string, string][];
  };
  const svg: {
    fontCache: 'local';
    localFont: {
      family: 'MathJax_Math',
      urls: ['/fonts/MathJax_Math-Italic.woff2']
    }
  };
  const options: {
    enableAssistiveMml: true,
    sre: {
      speech: 'shallow'
    }
  };
}
