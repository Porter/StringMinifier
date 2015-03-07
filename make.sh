if [ -f compiler.jar ];
then
   cat Utils.js BitArray.js Pack.js > comp.js
   java -jar compiler.jar --js comp.js --compilation_level SIMPLE > test.js
   echo "test.js made"
else
   echo "compiler.jar not found"
   echo "You get it here: https://github.com/google/closure-compiler"
fi


