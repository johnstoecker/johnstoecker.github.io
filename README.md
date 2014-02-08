Raxa-JSS: Outfriend
========
<quick overview of the functionality and architecture of OPD app>


Build Process
=======

**Webapp**

To create 'compiled' webapp builds, run the following sencha command:
```
sencha app build <build_type>
```
where ```<build_type>``` can be ```testing```, ```production```, or ```package```.

For more information on the role of each of these build types, please see the sencha cmd documentation. (Note that the ```production``` webapp build is not yet working for Outfriend. This version concatenates most of the applications JavaScript files, but for any .js files referred to in app.json, it fetches those JavaScript files dynamically. This causes the app to fail to load, if you include a file like Util.js in app.json. The reason is that Util.js contains which has global variables and functions which are called during setup, but because the files haven't been fetched yet, setup fails.)

**Native**

To create the native (device or emulator) builds, Sencha touch uses the packager.json file to configure build options.

- [iOs Packaging](http://docs.sencha.com/touch/2-0/#!/guide/native_packaging)
- [Android Packaging](http://docs.sencha.com/touch/2-0/#!/guide/native_android)
- [iOs Provisioning](http://docs.sencha.com/touch/2-0/#!/guide/native_provisioning)

To build, exceute the following command 
```
sencha app build native
```

Running the App
===================

Outfriend can run as a web app or as a native app.

1) To run the webapp
 - for the normal version, navigate to ```<host>/src/outfriend```
 - to run a 'compiled' (minified, concatenated JS files, etc) version of the webapp, navigate to ```<host>/src/outfriend/build/RaxaEmr.Outfriend/<build_type>```, where ```<build_type>``` can be ```testing```, ```production```, or ```package```

2) To run the native app, you'll need to build a native version to deploy on your iPad or Android tablet. If the build is successfully, it prints a command to the terminal's output which you can execute directly in order to run the app. Foe example, to run the application on the iOS emulator, the command is something like ```sencha package run packager.temp.json```)

Running tests
=============
At present, there are no automated tests for the outfriend module.