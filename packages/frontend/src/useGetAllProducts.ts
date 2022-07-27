import {useQuery} from "@tanstack/react-query";
import wellKnownQueries from "./wellKnownQueries";

type Product = {
    key: string;
    description: string;
    title: string;
    availableStock: number;
};
const apiRequest = async (): Promise<Product[]> => {
    const result = await fetch(
        `${import.meta.env.VITE_API_HOST}/products-api/products/dapr`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }
    );

    const resultJson = await result.json();

    return resultJson as Product[];
};

export default function useGetAllProducts() {
    return useQuery(wellKnownQueries.getAllProducts, () => apiRequest());
}
