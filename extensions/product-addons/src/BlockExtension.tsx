import {
  reactExtension, useApi, AdminBlock, BlockStack, TextField, Checkbox, Button, InlineStack, Text, Icon, Divider, Image, Form, Box, ProgressIndicator
} from '@shopify/ui-extensions-react/admin';
import { getProducts, getProductsMetafields, updateProductsMetafields, getMedia } from './utils';
import { useState, useEffect, useCallback } from 'react';

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.block.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n and data.
  const { data } = useApi(TARGET);
  const [loader, setLoader] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [productData, setProductData] = useState([]);
  const [crossProducts, setCrossProducts] = useState([]);
  const [productsMedia, setProductsMedia] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const productId = data.selected[0].id;
  const [error, setError] = useState('');
  let timer;
  const handleTextChange = async (key) => {
    timer && clearTimeout(timer);
    
    setSearchKey(key)
    if(key.length >= 3){
      setLoader(true)
      timer = setTimeout(async () => {
        let ids = [];
        const id = productId.replace('gid://shopify/Product/', '');
        let productIDs = crossProducts.map(product => product.id)
        ids.push(id, ...productIDs )
        productIDs = ids.map(id => `NOT id:${id}`).join(" AND ");
        const fetchedProductData = await getProducts(key, productIDs);
        setProductData(fetchedProductData.data.products.edges);
        setLoader(false)
      }, 1000);
    }else{
      setProductData([]);
    }
    
  };

  const handleCheckboxChange = (productId) => {
    // Toggle selection of product based on productId
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const addToCrossSell = async () => {
    // Add selected products to cross-sell list
    const selectedProductsData = productData.filter(
      (product) => selectedProducts.includes(product.node.id)
    );
    const newCrossProducts = [
      ...crossProducts,
      ...selectedProductsData.map((product) => ({
        id: product.node.id.replace('gid://shopify/Product/', ''),
        title: product.node.title,
        handle: product.node.handle,
        rowAction: ''
      })),
    ];

    // Update cross-sell list
    setCrossProducts(newCrossProducts);

    // Clear selected products and input text after adding
    setSelectedProducts([]);
    setProductData([])
    setTimeout( async () => {
      const productsMediaData = await getMedia(newCrossProducts)
      setProductsMedia(productsMediaData.data.products.edges);
    },[1000])
  };

  useEffect(() => {
    const getProductsMetaData = async () => {
      const metafieldsData = await getProductsMetafields(productId);
      if (metafieldsData.data.product.metafield) {
        const crossProductsData = JSON.parse(metafieldsData.data.product.metafield?.value).crossProducts;
        crossProductsData.map((product) => {
          product.rowAction = ''
        })
        if(crossProductsData.length) {
          setCrossProducts(crossProductsData);
          const productsMediaData = await getMedia(crossProductsData)
          setProductsMedia(productsMediaData.data.products.edges);
        }
      }
    };
    getProductsMetaData();
  }, [productId]);

  const handleInputChange = (id, val) => {
    const updatedData = crossProducts.map(item => {
      if (item.id === id) {
        return { ...item, rowAction: (val == true) ? 'delete' : '' };
      }
      return item;
    });
    setCrossProducts(updatedData);
  };

  // const handleInputChange = (id, val) => {
  //   if (val === true) {
  //     setCrossProducts((prev) => prev.filter((item) => item.id !== id));
  //   }
  // };

  const onSubmit = useCallback(async () => {
    const filterObj = []
    for (let i = 0; i < crossProducts.length; i++) {
      if (crossProducts[i].rowAction !== "delete") {
        filterObj.push({
          id: crossProducts[i].id,
          title: crossProducts[i].title,
          handle: crossProducts[i].handle
        });
      }
    }
    await updateProductsMetafields(productId, { crossProducts: filterObj });

  }, [crossProducts, productId]);

  const onReset = useCallback(() => {
    setError('');
  }, []);


  return (
    // The AdminBlock component provides an API for setting the title of the Block extension wrapper.
    <AdminBlock title="Product Addons">
      <Form id="form" onSubmit={onSubmit} onReset={onReset}>
        <BlockStack gap={true}>
          {crossProducts.length > 0 ?
            <>
              <InlineStack gap={'large'}>
                <InlineStack gap={'large'} inlineAlignment="start"><Text fontWeight="bold">Assign Products</Text></InlineStack>
                <InlineStack gap={'large'} inlineAlignment="end"> <Text fontWeight="bold">Delete</Text></InlineStack>
              </InlineStack>
              {crossProducts.map((product) => (
                <InlineStack key={product.id} gap={'large'} blockAlignment="center">
                  <InlineStack gap={'large'} blockAlignment="center" inlineAlignment="start">
                    {productsMedia.length > 0 && (

                      <Box inlineSize='25px'>
                        <Image id="ext-image" source={productsMedia.find(media => media.node.id.replace('gid://shopify/Product/', '') === product.id)?.node?.featuredImage?.url || 'https://cdn.shopify.com/shopifycloud/shopify/assets/default-app-74bfb89634baf86f3402062ef55df218fe55b4f2775ff605d0ccfe1a20f9c0d3_36x.png'} />
                      </Box>
                    )}
                    <Text fontWeight="bold">{product.title}</Text></InlineStack>
                  <InlineStack gap={'large'} inlineAlignment="end"><Checkbox id="checkbox" name="checkbox" onChange={(val) => {
                    handleInputChange(product.id, val);
                  }} /></InlineStack>
                  {/* <Button
                      variant="tertiary"
                      onClick={() => handleInputChange(product.id, true)}
                    >
                      <Icon tone='critical' name="DeleteMajor" />
                    </Button> */}
                </InlineStack>
              ))}
            </>
            : <InlineStack inlineAlignment="center" padding="large"><Text fontWeight="bold-200">Assign FBT Products</Text></InlineStack>}
          <Divider />
          <TextField
            label=""
            onInput={handleTextChange}
            placeholder='Search and assign FBT products'
            id="query"
          />

          {(searchKey.length && (searchKey.length < 3 )) ? <Text fontWeight="bold-200">Please enter at least 3 characters to search</Text> : ''} 
          {loader && (<InlineStack inlineAlignment="center"><ProgressIndicator size="small-100" /></InlineStack>)}

          {((!productData.length) && (searchKey.length >= 3 ) && (!loader)) ? <Text fontWeight="bold-200">No results found</Text> : ''}

          {(selectedProducts.length > 0) && (
            <InlineStack gap={'large'} inlineAlignment="end">
              <Button variant="primary" onClick={addToCrossSell}>
                Add
              </Button>
            </InlineStack>
          )}
          
          {productData && (
            productData.map((product) => (
              <>                
                <InlineStack gap={'large'} inlineAlignment="start">
                <Checkbox id={`checkbox-${product.node.id}`} name="checkbox" key={product.node.id} checked={selectedProducts.includes(product.node.id)} onChange={() => handleCheckboxChange(product.node.id)}>
                </Checkbox>
                <Box inlineSize='25px'><Image id="ext-image" alt={product.node.title} source={(product.node.featuredImage) ? product.node.featuredImage.url : 'https://cdn.shopify.com/shopifycloud/shopify/assets/default-app-74bfb89634baf86f3402062ef55df218fe55b4f2775ff605d0ccfe1a20f9c0d3_36x.png'} /></Box>
                <Text fontWeight="bold">{product.node.title}</Text></InlineStack>
              </>              
            ))
          )}
         
        </BlockStack>
      </Form>
    </AdminBlock>
  );
}