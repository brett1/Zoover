var isSpam = require("spam-detector");
isSpam("http://www.github.com", function(err, data){
console.log(data);
});