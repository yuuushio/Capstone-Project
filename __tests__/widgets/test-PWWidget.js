// Test for GRWidget class

import {strict as assert} from 'assert';
import {GDocsWidget} from "../../www-root/widgets/GApps/GDocsWidget.js";

let instance;

describe('GRWidget', function(){

    beforeEach(function(){
        instance = new GDocsWidget();
    })

    it('should initialise', function(){
        assert(instance);
    })

})
