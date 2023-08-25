mkdir package

cp -rf icons package/
cp -rf change-title.js package/
cp -rf manifest.json package/
cp -rf settings.html package/
cp -rf settings.js package/

zip -r title-morph.zip package
rm -rf package
