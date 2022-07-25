import ApiError from "./ApiError";
import ApiLoading from "./ApiLoading";
import useGetAllProducts from "./useGetAllProducts";

// Just a simple app to demonstrate end to end tracing
function App() {
    const {data: allProducts, status} = useGetAllProducts();
    if (status === "loading" || allProducts === undefined) {
        return <ApiLoading />;
    }

    if (status === "error") {
        return <ApiError />;
    }
    return (
        <div className="App">
            <h1>Product List</h1>
            {allProducts.map((p) => (
                <dl key={p.key}>
                    <dt>Title</dt>
                    <dd>{p.title}</dd>
                    <dt>Description</dt>
                    <dd>{p.description}</dd>
                    <dt>Available Stock</dt>
                    <dd>{p.availableStock}</dd>
                    <dt>Key</dt>
                    <dd>{p.key}</dd>
                    <pre>======================</pre>
                </dl>
            ))}
        </div>
    );
}

export default App;
