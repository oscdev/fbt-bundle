import {
    Page,
    Layout,
    Card,
    List,
    BlockStack,
    Divider,
    Text,
    Spinner,
    Button
} from "@shopify/polaris";
import "../assets/index.css";
import { Footer } from "../components/Footer";
import { useNavigate } from "@remix-run/react";
import { ListBulletedIcon } from "@shopify/polaris-icons";
import bulkProduct from "../assets/images/bulkProduct.png";
import productPage from "../assets/images/productPage.png";
import adminBlock from "../assets/images/adminBlock.png";
import product from "../assets/images/product.png";
import productScroll from "../assets/images/productScroll.png";


export default function Assign() {
    const navigate = useNavigate();
    return (
        <div className="appAssign">
            <Page 
            title={<>
                Assign Frequently Bought Together Products{"  "}
                {navigate.state === "loading" ? (<span className="loader" style={{ marginLeft: "20px" }}><Spinner size="small" /></span>) : (<> </>)}</>}
                backAction={{ content: "Settings", url: "/app" }}
            >
                 <BlockStack gap="400">
                <Card>
                        <Text variant="headingMd" as="h4">
                            Frequently Bought Together
                        </Text>
                        <Button icon={ListBulletedIcon}>Assign Products</Button>
                        {/* onClick={() => navigate("https://admin.shopify.com/store/manoj-oscp/products")} */}
                </Card>
                    
                <Card>
                    <Layout sectioned>
                        <BlockStack gap="400">
                    <Text variant="headingMd" as="h4"> How to Assign Frequently Bought Together Products Guidelines?</Text>
                            <Divider borderColor="border" />
                            <Layout.AnnotatedSection
                                id="storeDetails"
                                title="To assign Frequently Bought Together products from the product admin page"
                            >
                                <Card>
                                    <BlockStack gap="400">
                                        <Text variant="bodyLg" as="p">
                                            Choose Two Frequently Bought Together Products to include as optional add-ons,
                                            enhancing the product page experience for customers.
                                        </Text>
                                        <List type="number">
                                            <List.Item>In Admin, Navigate to the Product page.</List.Item>
                                            <List.Item>Select specific product in that page below display the Frequently Bought Together Admin Block. </List.Item>
                                            <List.Item>In search input field search product, Select the product you want to assign. </List.Item>
                                            <List.Item>Click the Add button first, then proceed to save the form by clicking the save button.
                                            </List.Item>
                                        </List>
                                        <img
                                            style={{ border: "3px solid #dfe3e8" }}
                                            alt="Theme Setup"
                                            width="100%"
                                            src={product}
                                        />
                                        <img
                                            style={{ border: "3px solid #dfe3e8" }}
                                            alt="Theme Setup"
                                            width="100%"
                                            src={productScroll}
                                        />
                                        <img
                                            style={{ border: "3px solid #dfe3e8" }}
                                            alt="Theme Setup"
                                            width="100%"
                                            src={adminBlock}
                                        />
                                    </BlockStack>
                                </Card>
                            </Layout.AnnotatedSection>
                            <Divider borderColor="border" />
                            <Layout.AnnotatedSection
                                id="assign"
                                title="To assign Frequently Bought Together  products for a Multiple / All product"
                            >
                                <Card>
                                    <List type="number">
                                        <List.Item>In App, Navigate to the Assign Section.</List.Item>
                                        <List.Item>Select "Assign Products" to access the product page.</List.Item>
                                        <List.Item>Select checkbox for Multiple / All products</List.Item>
                                        <List.Item>Click on the three dots and choose the Upsell Cross-sell app.</List.Item>
                                        <List.Item>The form will appear with the main product; click on "Assign product."</List.Item>
                                        <List.Item>Add two Frequently Bought Together products to the main product, then save the changes.</List.Item>
                                    </List>
                                    <img
                                        style={{ border: "3px solid #dfe3e8" }}
                                        alt="Theme Setup"
                                        width="100%"
                                        src={bulkProduct}
                                    />
                                </Card>
                            </Layout.AnnotatedSection>
                            <Divider borderColor="border" />
                            <Layout.AnnotatedSection
                                id="storeDetails"
                                title="To assign Frequently Bought Together products for a single product"
                            >
                                <Card>
                                    <List type="number">
                                        <List.Item>In App, Navigate to the Assign Section.</List.Item>
                                        <List.Item>Select "Assign Products" to access the product page.</List.Item>
                                        <List.Item>Pick the product you wish to assign Frequently Bought Together  products.</List.Item>
                                        <List.Item>Select "More Actions" and Click on the upsell cross-sell app.</List.Item>
                                        <List.Item>The form will appear with the main product; click on "Assign product."</List.Item>
                                        <List.Item>Add two Frequently Bought Together  products to the main product, then save the changes.</List.Item>
                                    </List>
                                    <img
                                        style={{ border: "3px solid #dfe3e8" }}
                                        alt="Theme Setup"
                                        width="100%"
                                        src={productPage}
                                    />
                                </Card>
                            </Layout.AnnotatedSection>
                        </BlockStack>
                    </Layout>
                </Card>
                </BlockStack>
                <Footer />
            </Page>
        </div>
    )
}

