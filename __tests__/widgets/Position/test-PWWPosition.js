// Tests for PWWPosition Class
import {strict as assert} from 'assert';
import {PWWPosition} from "../../../www-root/widgets/Positions/PWWPosition.js";

/** @type {PWWPosition} */
let subject;

describe('PWWPosition Class', () => {

    it('should construct without params and init to 0', () => {
        subject = new PWWPosition();
        assert(subject);
        assert(subject.x === 0);
        assert(subject.y === 0);
    });

    it('should construct with specified values', () => {

        const x = 87628.231811;
        const y = 192984.382821;

        subject = new PWWPosition(x, y);
        assert(subject);
        assert(subject.x === x);
        assert(subject.y === y);

    })

    it('should apply vector normally', () => {

        const x = 87628.231811;
        const y = 192984.382821;

        const dx = 4.77221;
        const dy = 201.333;

        subject = new PWWPosition(x, y);
        let result = subject.applyVector(dx, dy);

        assert(result instanceof PWWPosition);
        assert(result.x = x + dx);
        assert(result.y = y + dy);

    });

});