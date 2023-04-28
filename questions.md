1.  <strong>What is the difference between Component and PureComponent? Give
    an example where it might break my app.</strong>

- PureComponent is a Class component that implements the method "shouldComponentUpdate" update. It's like the Class component version of the HOC React.Memo. The shouldComponentUpdate method will do a shallow comparison of the component's state to avoid unnecessary re-renders.

2. <strong>Context + ShouldComponentUpdate might be dangerous. Why is that</strong>

- The shouldComponentUpdate + Context might be dangerous because if the Context for the parent change, and one of the children is a PureComponent, the shouldComponentUpdate() method will return false because it doesn't check for context update, just state and props, therefore we would show outdated information.

3. <strong>Describe 3 ways to pass information from a component to its PARENT.</strong>

- You can do it by using the useContext hook, you can use a callback and also you could create a Custom Event and emit it from the child component.

4. <strong>Give 2 ways to prevent components from re-rendering.</strong>
   Using hooks like useRef/useCallBack/useMemo and using React.Memo.

5. <strong>What is a fragment and why do we need it? Give an example where it might
   break my app.</strong>

- Fragments are a type of react component that serves as a wrapper for other React nodes. Trying to render two nested elements would throw a error, but with fragment we can render multiple elements by placing them inside the fragment.

6. <strong>Give 3 examples of the HOC pattern.</strong>

- In Redux, there's the connect function that will connect a component to the Redux store.
- There is React.memo that helps optimize performance by memoizing the component that is passed.
- There's also the withRouter HOC from the NextJS framework, that injects the router prop into a component.

7. <strong>What's the difference in handling exceptions in promises, callbacks
   and async…await?</strong>

- In a callback you would generally pass the error handling inf the callback argument while in a Promise you would use the method chaining and catch the error using the catch() method and return a value or continue with the then() if you want.
- Async functions are a type of function that can use the await keyword in the body (at least it was, before the top level await from ES2020 came in). It's worth to mention that every async function will return a Promise.

8. How many arguments does setState take and why is it async.

- Two arguments: the first is the new state or the updater function and the second is a callback.

9.  <strong>List the steps needed to migrate a Class to Function Component.</strong>

- Replace the class with a function
- Remove the constructor and move the state declaration to a useState hook and move props to the function argument
- Replace render method with a return
- Remove the "this" references
- Replace the lifecycle methods with useEffect
- Replace method classes with functions

10. <strong>List a few ways styles can be used with components.</strong>

- Styles can be used in various ways:
  - inline with objects
  - CSS modules where you can scope the styles
  - CSS in JS with libraries like Styled Component
  - A preprocessor like SASS/LESS
  - You can also just use pure CSS and import the .css files you want

11. <strong>How to render an HTML string coming from the server.</strong>

- With the method dangerouslySetInnerHTML, but we should be careful when doing that because it may be a security risk because of XSS
