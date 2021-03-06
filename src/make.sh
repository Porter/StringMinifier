DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR
if [ -f compiler.jar ];
then
   cat Utils.js BitArray.js Pack.js manager.js > minifier.js
   java -jar compiler.jar --js minifier.js --compilation_level SIMPLE > minifier-min.js
   echo "minifier-min.js made"
else
   echo "compiler.jar not found"
   echo "You get it here: https://github.com/google/closure-compiler"
fi


