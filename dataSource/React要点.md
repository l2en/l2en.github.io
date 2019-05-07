#### React要点：

+ **React中key的作用是什么？**

  + React中key为了diff算法中的追踪减少不必要的元素渲染

+ **调用setState后发生什么？** 

  + React会将传入的state进行重组，重组完成后会根据前后元素树进行新旧差异的对比，使用diff算法对界面进行最小化重渲染

+ **生命周期**：

  初始化阶段

  + getDefaultProps： 获取实例的默认属性
  + getInitialState：获取每个实例的初始状态
  + componentWillMount：组件即将挂载到页面
  + render：生成虚拟DOM节点
  + componentDidMount：组件被挂载后

  运行时

  + componentWillReceiveProps： 组件在接收父组件props前
  + shouldComponentUpdate：组件是否更新判断(重点)
  + componentWillUpdate：组件即将更新(此处不能修改state，否者会导致死循环)
  + render：组件重绘
  + componentDidUpdate：组件已完成更新

  销毁

  + componentWillUnmount： 组件即将销毁(在此处进行取消监听函数等操作)

+ **shouldComponentUpdate有什么用？（或者问，要优化性能应该在哪个周期进行？）**

  可以控制组件的渲染与否，避免相同的（没必要）视图重复渲染，提高性能

  

+ **为什么虚拟dom能提高性能？**

  React和Vue等MVVM框架使用自有diff算法，避免没必要的真实DOM渲染，进而提高性能。    使用js对象结构表示DOM（虚拟DOM/对象树），完成所有修改后，再用这个对象结构一次性生成一个最终要呈现的视图； 数据变化都在js的监听下，数据改变后会生成一棵新js对象树，再使用diff算法与之前的js对象树进行对比，尽可能少的改变原dom树结构，最后再次重新渲染；

  >  简版代码如下 ([推荐看此文章](https://www.zhihu.com/question/29504639?sort=created))

  ```js
  // 1. 构建虚拟DOM
  var tree = el('div', {'id': 'container'}, [
      el('h1', {style: 'color: blue'}, ['simple virtal dom']),
      el('p', ['Hello, virtual-dom']),
      el('ul', [el('li')])
  ])
  
  // 2. 通过虚拟DOM构建真正的DOM
  var root = tree.render()
  document.body.appendChild(root)
  
  // 3. 生成新的虚拟DOM
  var newTree = el('div', {'id': 'container'}, [
      el('h1', {style: 'color: red'}, ['simple virtal dom']),
      el('p', ['Hello, virtual-dom']),
      el('ul', [el('li'), el('li')])
  ])
  
  // 4. 比较两棵虚拟DOM树的不同
  var patches = diff(tree, newTree)
  
  // 5. 在真正的DOM元素上应用变更
  patch(root, patches)
  ```

  

+ **React diff更新算法**

  + js对象树(虚拟dom)按层级分解，之比较同级元素
  + 给每个元素添加唯一key
  + React只会匹配同一组件下的差异变化
  + 合并操作，使用steState时，React会将其标记为dirty，等素有事件循环完成之后会将标记为dirty的组件进行重新绘制(此处需要重新理解)
  + React提供shouldComponentUpdate让开发人员确定组件是否需要重新渲染

+ **React中refs作用是什么？**

  + 诸如Vue或React的数据驱动框架原则上不建议直接进行dom操作，但也提供了开发者直接操作dom的能力—refs  。 一般会元素上添加ref属性，在其回掉中就能获取到该dom

    ```js
    <div ref={(thisDom) => this.state.dom = thisDom}></div>
    // this.state.dom即等于 document.getElementsByTagName('div')
    ```

+ **展示组件和容器组件有何不同？**
  + 展示组件只关心呈现画面，不关心数据。 原则上不会存在自身的state
  + 容器组件只关心数据状态(State)，会有自身的state可能会有其他组件传来的props
+ **类组件和函数式组件有何区别？**
  + 类组件可以使用state、props和所有的生命钩子
  + 函数组件可以访问state或props，无法完整使用生命钩子，可以一定程度上理解为"类组件中的展示组件"
+ **state和props有何不同？**
  + state是组件数据结构，可能随用户操作而变化
  + props是父组件传递而来，作为子组件不能修改props
+ **什么是受控组件？**

  + 受控组件针对于诸如<input> <select> <texarea>等表单元素。由于这些元素自身会维护自身的数据状态(即元素本身会自动获取数据)，并在界面做相应变化。 在React中所有的数据状态都应该有state同意管理，在改变<input>的值时应该使用onchange事件进行state的修改，把input的值作为一个由React的操作，这样的组件叫"受控组件"，且推荐使用受控组件
+ **什么是高阶组件？（HOC）**

  + 一个以组件作为参数并返回一个新组件的**函数**。 最常见的就是Reux的connect函数
+ **在构造函数(constructor)中调用super(props)的目的是什么？**

  + 因为组件都继承与React的Component，而子类在super调用前是无法按使用this的。传递props作为参数的原因是，便于在构造函数中使用this.props
+ **应该在哪里发起Ajx请求？**

  + 在ComponentDidMount，因为该生命周期在被添加到DOM时执行(已经在页面上有真是dom)。  Ajax的请求无法保证在dom已经完全挂载，如果不在ComponentDidMount周期使用，无法保证Ajax中的setState操作有对应的视图可操作。此时调用Ajax可以保证能够有组件可以更新

+ **React创建组件的方式**
  + React.createClass()
  + ES6 Class(最常用)
  + 无状态函数，直接return一个dom