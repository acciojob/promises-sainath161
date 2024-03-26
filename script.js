// MyPromise.js
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

module.exports = MyPromise;
