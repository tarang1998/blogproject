
// import Counter from "./app/features/counter/Counter";
import PostsList from "./app/features/posts/PostsList";
import AddPostForm from "./app/features/posts/AddPostForm";
// import './counter.css'
// import './posts.css'


function App() {
  return (
    <main className="App">
      {/* <Counter/> */}
      <AddPostForm />
      <PostsList />

    </main>
  );
}

export default App;
