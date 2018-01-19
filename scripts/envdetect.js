export default (function(){
    if(process.env.NODE_ENV === 'development'){
      var production = false;
    }else{
      var production = true;
    }
  return production;
})()
