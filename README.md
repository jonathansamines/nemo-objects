# Nemo Objects

Easily create and use the Page Object pattern in your nemo based tests, by using a simple api, mostly inspired by the [ember-cli-page-object](https://github.com/san650/ember-cli-page-object) ember addon, widely used in the ember ecosystem for functional and integration testing.

## Installation

```bash
  npm install --save nemo-objects
```

## Usage
### Configuring the nemo plugin
In your nemo configuration

```json
  {
    "plugins": {
      "nemo-objects": {
        "module": "nemo-objects",
        "arguments": [
          {
            "pagesLocation": "/path/to/page-objects"
          }
        ]
      }
    }   
  }
```

### Creating a page object
At the specified location, for any given file found a page object will be created at the `nemo.page` namespace. For example, if a file named `countryLanding.js` is found, then a page object is created as `nemo.page.countryLanding`.

At the `countryLanding.js` file, a page-object can be declared as follows:

```js
  'use strict';

  module.exports = function countryLanding(pageObject, nemo) {
    const { visitable, collection, text } = pageObject;

    return {
      visit: visitable(`${nemo.data.url}/country-landing`),
      countries: collection({
        scope: '.country-list',
        itemScope: 'ul li',
        item: {
          countryName: text('span')
        }
      })
    };
  };
``` 

Which later can be used at your functional tests as:

```js
  // all the setup code for your nemo environment
  // The `nemo` variable is made available here

  describe('At the country landing page', () => {
    it('All user countries are shown', async () => {
      const { countryLanding } = nemo.page;

      await countryLanding.visit();
      const countries = await countryLanding.countries();
      
      expect(countries.count).to.be.equal(4, 'the number of countries matches the user settings');
    });
  });
```


## API
A detailed documentation can be found here.