# Cordova App Template
This project is a template for cordova application that is based on javascript and JSX components.
Cordova App Template is using class based components that renders JSX which are later transformed into
HTML DOM elements. This is possible thanks to Babel. The project also supports routing components based on their paths registered in router.

**Tags**: JSX, Javascript, HTML, CSS, Babel

## State of project
### Completed features
 ✅ Creating instance of app<br />
 ✅ Transforming JSX into HTML DOM elements<br />
 ✅ Registering components in app instance when they are rendered<br />
 ✅ Setting up router based on given routes with path and specific component<br /> 
 ✅ Rendering a component based on current active route<br />
 ✅ Router view with default header that can be used as navigation if there are more routes in router history<br />

### What is planned 
 ⌛ Adding states that can be reactive in JSX view<br />
 ⌛ Adding Drawer Layout <br />
 ⌛ Adding Modal component<br />
 ⌛ Adding animated transitions between screen components<br />


## Configuration
Firstly you will need to download this template as ZIP and unzip it to destination in which you are comfortable
to work with. Before you start setting up project you need to have **cordova cli** installed globally so you can
work with cordova project. You can install it through terminal:

```
npm install -g cordova
```

After successfully installing `cordova CLI` you can install dependencies by starting termina from your project directory: 
```
npm install 
```

Now we can set up a platform on which we want to develop application:
```
# For Android
cordova platform add android

# For iOS
cordova platform add ios
```

Finally we configure cordova configuration in file `config.xml`. In this file we have update a few things:
- **Application Package** - a unique id of app that can be updated in `widget` element in attribute `id`. It should be
in format `com.example.nameapp`
- **Application Name** - can be defined in element `name` under parent element `widget`
- **Application Description** - can be defined in element `description` under parent element `widget`
```xml
<?xml version='1.0' encoding='utf-8'?>
<!-- HERE IN WIDGET ID YOU SHOULD CHANGE IT TO UNIQUE ID -->
<widget id="com.example.cordovaapp"  version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name><!-- HERE INSERT NAME OF YOUR APPLICATION --></name>
    <description><!-- HERE INSERT DESCRIPTION OF YOUR APPLICATION --></description>
    ...
</widget>
```

And now application can be run on specific platform by commands:
```
# For android
cordova run android

# For iOS
cordova run ios
```