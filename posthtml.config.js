const posthtmlInlineAssets = require("posthtml-inline-assets");
posthtmlInlineAssets({
  transforms: {
    a: {
      resolve(node) {
        return node.tag === 'a' && node.attrs && node.attrs.bookmarklet && node.attrs.href;
      },
      transform(node, data) {
        node.attrs.done = 'made it';
      }
    }
  }
});
module.exports = (ctx) => {
  return {
    "plugins": {
      'posthtml-inline-assets': posthtmlInlineAssets
    },
    "from": "src/views/*.html",
    "to": "dist",
    "posthtml-modules": {
      "root": "./src/views",
      "initial": true
    }
  }
}