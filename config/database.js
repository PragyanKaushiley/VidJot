if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: 'mongodb://Pragyan:Pragyan97@ds237610.mlab.com:37610/vidjot-prod-pragyan'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}
