// MyPromiseWithTests.js
const { expect } = require('chai');

class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      this.executeCallbacks(this.onFulfilledCallbacks, this.value);
    };

    const reject = reason => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      this.executeCallbacks(this.onRejectedCallbacks, this.value);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleFulfilled = value => {
        try {
          if (typeof onFulfilled === 'function') {
            const result = onFulfilled(value);
            resolve(result);
          } else {
            resolve(value);
          }
        } catch (error) {
          reject(error);
        }
      };

      const handleRejected = reason => {
        try {
          if (typeof onRejected === 'function') {
            const result = onRejected(reason);
            resolve(result);
          } else {
            reject(reason);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      } else if (this.state === 'fulfilled') {
        handleFulfilled(this.value);
      } else if (this.state === 'rejected') {
        handleRejected(this.value);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  executeCallbacks(callbacks, value) {
    setTimeout(() => {
      callbacks.forEach(callback => callback(value));
    }, 0);
  }
}

describe('MyPromise', () => {
  it('should resolve with value 10', () => {
    const promise = new MyPromise((res, rej) => {
      res(10);
    });
    expect(promise.state).to.equal('fulfilled');
    expect(promise.value).to.equal(10);
  });

  it('should reject with error', () => {
    const promise = new MyPromise((res, rej) => {
      rej('error');
    });
    expect(promise.state).to.equal('rejected');
    expect(promise.value).to.equal('error');
  });

  it('should handle chained then and catch', () => {
    const promise = new MyPromise((res, rej) => {
      res(10);
    });
    promise
      .then(val => {
        expect(val).to.equal(10);
        return val + 10;
      })
      .then(val => {
        expect(val).to.equal(20);
        throw val + 10;
      })
      .then(
        val => {
          expect(val).to.equal(30);
          return val + 10;
        },
        val => {
          expect(val).to.equal(20);
          return val + 20;
        }
      )
      .then(val => {
        expect(val).to.equal(40);
        throw val + 10;
      })
      .catch(val => {
        expect(val).to.equal(50);
        return val + 10;
      })
      .then(val => {
        expect(val).to.equal(60);
      });
  });

  it('should execute chained then asynchronously', () => {
    const promise = new MyPromise((res, rej) => {
      res(10);
    });
    const newPromise = promise.then();
    expect(newPromise).to.be.an.instanceOf(MyPromise);
    expect(newPromise.value).to.equal(null);
    expect(newPromise.state).to.equal('pending');
  });

  it('should return a pending promise when calling then without callbacks', () => {
    const promise = new MyPromise((res, rej) => {
      res(10);
    });
    const newPromise = promise.then();
    expect(newPromise).to.be.an.instanceOf(MyPromise);
    expect(newPromise.value).to.equal(10);
    expect(newPromise.state).to.equal('fulfilled');
  });
});
