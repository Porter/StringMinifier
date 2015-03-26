if [ -f compiler.jar ];
then
   cat Utils.js BitArray.js Pack.js manager.js > minifier-min.js
   echo "minifier-min.js made, but it wasn't compressed"
else
   echo "compiler.jar not found"
   echo "You get it here: https://github.com/google/closure-compiler"
fi


