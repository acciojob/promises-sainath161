//your JS code here. If required.
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

// Sample Usage #1
const promise = new MyPromise((res, rej) => {
  res(10);
});
promise
  .then(val => {
    console.log(val);
    return val + 10;
  })
  .then(val => {
    console.log(val);
    throw val + 10;
  })
  .then(
    val => {
      console.log(val);
      return val + 10;
    },
    val => {
      console.log('error: ' + val);
      return val + 20;
    }
  )
  .then(val => {
    console.log(val);
    throw val + 10;
  })
  .catch(val => {
    console.log('error: ' + val);
    return val + 10;
  })
  .then(val => {
    console.log(val);
  });
console.log('end'); // this line runs before the then/catch chain.

// Sample Usage #2
const promise2 = new MyPromise((res, rej) => {
  res(10);
});
promise2.then(val => {
  console.log(val + 10);
  return val + 10;
});
promise2.then(val => {
  console.log(val + 5);
  return val + 5;
});
console.log('end'); // this line runs before the then/catch chain.
