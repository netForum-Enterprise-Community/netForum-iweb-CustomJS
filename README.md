# netForum-iweb-CustomJS
UI customizations for 2017 iWeb

# Usage
1. Place the CustomJS.js file in /iweb/Scripts/ (and /eweb/Scripts/ if you want it to work in eWeb).
2. Update the IncludeFileList system option with a value of 'CustomJS.js?v=1'
   - When you make updates, you can increment the v= parameter in the IncludeFileList and clear cache, so that client web browsers pull the new version
3. Clear the netForum cache

# Basic Structure
This is a JS object broken up into several components. The $(document).ready calls PACCustom.Init();, which then calls the Init method for each component.
