import { useState, useCallback } from "react";
import { Card, Page, Button, InlineGrid, Tag, BlockStack, Frame, Toast, Text, Tooltip, Spinner, Box } from "@shopify/polaris";
import { useLoaderData, useNavigation, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Confirm } from "../components/Confirm";
import { Footer } from "../components/Footer";
import { bulkProduct } from "../services/index";
import { useSubmit } from "@remix-run/react";

async function getProductIds(ids, request) {
  const bulkProductId = await bulkProduct.requestID(ids, request);
  return bulkProductId;
}

export const loader = async ({ request }) => {
  let url = new URL(request.url);
  let ids;
  if (url.searchParams.has('ids[]')) {
    ids = new URLSearchParams(url.search).getAll("ids[]");
  } else {
    ids = new URLSearchParams(url.search).getAll("id");
  }
  return json(await getProductIds(ids, request));
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) || [];
  const stageStatus = await bulkProduct.bulkFormOperation(data, request);
  return json({ stageStatus });
};

const Bulkform = () => {
  const submitForm = useSubmit();
  const [activeProductCard, setActiveProductCard] = useState(null);
  const navigation = useNavigation();
  const handleResourcePickerClose = useCallback(
    () => setActiveProductCard(null),
    []
  );
  const [isConfirmExit, setIsConfirmExit] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("Are you sure you want to exit?");
  const [products, setProducts] = useState(useLoaderData());
  const [productIndex, setProductIndex] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isProductRemove, setIsProductRemove] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();
  const handleSelection = useCallback((selectedProducts, parentId) => {
    const selectedObj = selectedProducts.selection.map((selected) => ({
      id: selected.id.split("/").pop(),
      title: selected.title,
      handle: selected.handle,
    }));

    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id === parentId) {
          const updatedCrossProducts = product.crossProducts
            ? [...product.crossProducts, ...selectedObj]
            : selectedObj;
          return { ...product, crossProducts: updatedCrossProducts };
        }
        return product;
      });
    });

    setActiveProductCard(null); // Reset the activeProductCard state after selection
  }, []);

  const handleRemoveProduct = (targetId, parentId) => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id === parentId) {
          const updatedCrossProducts = product.crossProducts.filter(
            (product) => product.id !== targetId
          );
          return { ...product, crossProducts: updatedCrossProducts };
        }
        return product;
      });
    });
  };

  const [filterResourceStr, setFilterResourceStr] = useState([]);
  const openResourcePicker = useCallback(async (productId, crossProducts) => {
    setActiveProductCard(productId);
    let gqId = productId.split('/');
    gqId = gqId[gqId.length - 1];
    const filterObj = [];
    filterObj.push("NOT " + gqId)
    if (crossProducts) {
      for (var i = 0; i < crossProducts.length; i++) {
        filterObj.push("NOT " + crossProducts[i].id)
      }
    }


    setFilterResourceStr(filterObj);

    const pickedResources = await window.shopify.resourcePicker({
      type: 'product',
      filter: {
        variants: false,
        query: filterObj.join(" AND "),
      },
      action: 'select',
      multiple: false,
    });

    if (pickedResources && pickedResources.selection.length > 0) {
      handleSelection(pickedResources.selection, productId);
    }
  }, [handleSelection, filterResourceStr]);

  // Manage selected product remove
  function removeProduct(productId, index) {
    setConfirmationMessage(`Are you sure you want to remove this product?`);
    setProductIndex({ productId, index });
    setIsProductRemove(true);
  }

  // Manage confirmation dialog box for selected product remove or not
  function onConfirmProductRemove(productId, index) {
    handleRemoveProduct(productId, index);
    setIsProductRemove(false);
    setConfirmationMessage("");
  }

  // Manage selected product not remove
  function onCancelRemove() {
    setIsProductRemove(false);
  }

  const handleSave = async () => {
    const updatedProducts = products.map((product) => ({
      id: product.id, // Extracting product ID from the URL
      crossProducts: product.crossProducts
        ? product.crossProducts.map((crossProduct) => ({
          id: crossProduct.id, // Extracting cross product ID from the URL
          title: crossProduct.title,
          handle: crossProduct.handle,
        }))
        : [], // If no cross products, send an empty array
    }));
    
    await submitForm(
      { productsJson: JSON.stringify(updatedProducts) },
      { method: "post" }
    );
    
    setTimeout(async() => {
    setToastMessage({
      content: "Successfully data saved.",
      error: false,
    });
  }, 2000)
  };

  // Confirm exit function to ask the user if they want to exit without saving
  const confirmExit = () => {
    setIsConfirmExit(true);  // Open the confirmation modal
  };

  // Handle user confirming exit action
  const onConfirmExit = () => {
    setIsConfirmExit(false); // Close the modal
    // Here you can redirect or perform any back action
    navigate("/app"); // Example: Go back to the previous page
  };

  // Handle user canceling exit action
  const onCancelExit = () => {
    setIsConfirmExit(false); // Close the confirmation modal
  };

  return (
    <div className="customPage">
      <Page
        title="Frequently Bought Together Product Editor"
        backAction={{ content: "Settings", onAction: () => confirmExit() }}
        primaryAction={
          <Button icon={(navigation.state === "loading") ? <Spinner size="small" /> : <></>} variant="primary" onClick={handleSave}>
            Save
          </Button>
        }
      >
        <Frame>
          {products.map((product) => {
            const { id, title, crossProducts } = product;
            return (
              <BlockStack gap="100" key={product.id}>
                <Box padding="200">
                <Card>
                  <BlockStack gap="400">
                    <InlineGrid columns="1fr auto">
                      <Text variant="headingMd" as="h6">
                        {title}
                      </Text>
                      {crossProducts && crossProducts.length > 1 ? <> <Tooltip active content="Only 2 products can be selected">
                        <Button
                          variant="primary"
                          textAlign="left"
                          onClick={() => openResourcePicker(id, crossProducts)}
                          disabled={crossProducts && crossProducts.length > 1}
                        >
                          Assign Product
                        </Button>
                      </Tooltip></> : <> <Button
                        variant="primary"
                        textAlign="left"
                        onClick={() => openResourcePicker(id, crossProducts)}
                        disabled={crossProducts && crossProducts.length > 1}
                      >
                        Assign Product
                      </Button></>}
                    </InlineGrid>
                    <div className="Polaris-IndexTable-ScrollContainer">
                      <table
                        className="Polaris-IndexTable__Table Polaris-IndexTable--tableStickyLast CustomTable"
                        border="0"
                      >
                        <tbody>
                          <tr className="Polaris-IndexTable__TableRow priceRow">
                            <td>
                              Assign Products
                            </td>
                            <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                              <InlineGrid gap="400" columns={3}>
                                {crossProducts &&
                                  crossProducts.map(({ id: productId, title }) => (
                                    <Tag
                                      key={productId}
                                      onRemove={() =>
                                        removeProduct(productId, id)
                                      }
                                    >
                                      {title}
                                    </Tag>
                                  ))}
                              </InlineGrid>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </BlockStack>
                </Card>
                </Box>
              </BlockStack>
            );
          })}
          <Confirm
            isConfirm={isProductRemove}
            confirmMsg={confirmationMessage}
            onConfirm={() =>
              onConfirmProductRemove(productIndex.productId, productIndex.index)
            }
            onCancel={onCancelRemove}
          />
          {toastMessage && (
            <Toast
              content={toastMessage.content}
              onDismiss={() => setToastMessage(null)}
              error={toastMessage.error}
            />
          )}
          <Box padding="100">
          <Footer />
          </Box>
        </Frame>
      </Page>
      <Confirm
        isConfirm={isConfirmExit}
        confirmMsg={confirmMsg}
        onConfirm={onConfirmExit}
        onCancel={onCancelExit}
        returnData={null}
      />
    </div>
  );
};

export default Bulkform;
