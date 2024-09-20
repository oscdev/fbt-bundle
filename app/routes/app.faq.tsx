import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  List,
  Collapsible,
  Link,
  ButtonGroup,
  Button,
  Divider,
  Text,
  Spinner
} from "@shopify/polaris";
import { EmailIcon, ChatIcon } from "@shopify/polaris-icons";
import "../assets/index.css";
import { Footer } from "../components/Footer.jsx";
import { useNavigation } from "@remix-run/react";


export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const navigation = useNavigation();
  const faqsObj = [
    {
      title: "Related Frequently Bought Together Products guide",
      topic: "How to add FBT to a products?",
      description:
        "1. In Shopify Admin Navigate to the Assign Section.<br/> 2. Select <b>Assign Offer </b>to access the product page. <br/> 3.  Pick the product you wish to assign Frequently Bought Together products. <br/> 4. Select <b>More Actions </b>and Click on the upsell cross-sell app.<br/> 5. The form will appear with the main product; click on<b> Assign product.</b><br/> 6. Add Frequently Bought Together products to the main product, then save the changes.<br/> <b>Offer Display:</b>The Frequently Bought Together offer will now be created and displayed on the product page of your store for customers to see.",
      expand: false,
    },
    {
      title: "",
      topic: "How to assign Frequently Bought Together Products from the product admin page?",
      description:
        "<b>To assign Frequently Bought Together  products from the product admin page:</b><br/>Go to Products in shopify admin => Click on Product in which you want to apply a Frequently Bought Together => Scroll down the product page you will see the App Block section  In which you have to click on + App Block and then select Frequently Bought Together =>Click on 'Input search and assign FBT products =>Click on the Add button =>Click 'Save' to update the FBT products.",
      expand: false,
    },
    {
      title: "",
      topic: "Why is the widget(section) not appearing in my online store?",
      description:
        "For the offer widget to visible in the product page, the following steps are required:<br/> 1. The app has to be enabled.<br/> 2. The product page you are viewing should have a corresponding offer setup.<br/> 3. The widget(section) position should be set up correctly.",
      expand: false,
    },
    {
      title: "",
      topic: "How can I Enable/Disable Frequently Bought Together section?",
      description: "To Enable/Disable Frequently Bought Together section you need to follow below steps:<br/> <b>Manual Process</b><br/>To Enable/Disable you have go to App Settings, click Sales Channel => Online Store => Customization => In Home Page drop down select Products => Click on Default Product => In Apps Section Click on Add block => In APPS add Frequently Bought block => In Title add and update heading => click on Save button on the top right corner.<br/> <b>Automated Process</b><br/> To Enable/Disable Frequently Bought block section, Click on Activate App in Settings =>  In Apps click on Frequently block => In Title add and update heading => Click on Save button on the top right corner.",
      expand: false,
    },
    {
      title: "",
      topic: "How to change Title Heading?",
      description:
        "Title heading text can be updated from Shopify admin, Click on Sales Channel &#61;&#62; Online Store &#61;&#62; Customization  &#61;&#62; In Home Page drop down select Products &#61;&#62; Click on Default Product &#61;&#62; In APPS click on Frequently bought block &#61;&#62; Add Frequently Bought Together Title &#61;&#62; click on Save button on the top right corner.",
      expand: false,
    },
    {
      title: "",
      topic: "Will this app integrate with another app I have?",
      description:
        "We would like to explore this too. Please reach out to our support and let us know your requirements. We'll be glad to help.",
      expand: false,
    },
    {
      title: "",
      topic: "Does it work with shopify's default add to cart button?",
      description:
        "No, we are providing our customized add to cart button with our Frequently Bought Together products on the Product page.",
      expand: false,
    },
    {
      title: "",
      topic: "What are the Different Widget/Templates available?",
      description:
        "We are having one widget as of now that is Frequently Bought Together. For Customization <b><a class='customLink' target='_blank' href='https://www.oscprofessionals.com/oscp-upsell-cross-sell-app-support/'>Contact Us</a></b>",
      expand: false,
    },
    {
      title: "",
      topic:
        "How can I activate Frequently Bought Together products within my theme on the product page?",
      description:
        "<b>We are providing a template for Frequently Bought Together products on product page <br/>The steps you need to follow: </b><br/> 1. Navigate to the 'Online Store' section of your store, then go to the Customize section of your theme. <br/> 2. On the site preview on the right, navigate to any of your product pages until you have a 'Add sections' displayed on the menu on the left. <br/> 3. Click on the Add block and select the Frequently Bought block inside the app section. <br/> 4. Click on the save button on the top right corner. <br/> You can also drag and drop an Frequently Bought block as per your requirement.",
      expand: false,
    },
    {
      title: "",
      topic: "Does your app manage Frequently Bought Together products at the variant level?",
      description:
        "No, Our app handles only simple products and the first variant of the product.",
      expand: false,
    },
    {
      title: "",
      topic: "Does your App support Import/Export?",
      description:
        "No, We are not handling Import/Export. It will be handled in the Future release.",
      expand: false,
    },
    {
      title: "",
      topic: "What will happen if the product is out of stock?",
      description:
        "Out of stock products will not display on the FBT section in the product page.",
      expand: false,
    },
    {
      title: "",
      topic: "What will happen if the inventory of the product is insufficient in the admin?",
      description:
        "If the inventory of a product is insufficient, and when multiple 'frequently bought together' products are added to the cart on the product page, continuously adding three or more products when one of them has insufficient inventory will trigger an error message. This message will specify the particular product item with insufficient quantity.",
      expand: false,
    },
    {
      title: "Discount codes",
      topic:
        "Will the Default Shopify discount codes work with Frequently Bought Together products?",
      description:
        "Yes, Shopify default discount codes work at the checkout page with Frequently Bought Together products.",
      expand: false,
    },
    {
      title: "",
      topic: "Can I offer a Frequently Bought Together product with a discount?",
      description:
        "No, as per now we are not handling any kind of discount features which are applied to Frequently Bought Together products.",
      expand: false,
    },
    {
      title: "",
      topic:
        "Are Shopify Pricing and Discount Impacted with Frequently Bought Together Products?",
      description:
        "No, shopify discounts will apply.",
      expand: false,
    },
    {
      title: "Theme Version compatibility",
      topic: "Does this App support Shopify 2.0 themes?",
      description:
        "Yes, App supports Shopify 2.0 Themes. In case there are some custom changes on your store, you can make App compatible with simple changes in App embeds.",
      expand: false,
    },
    {
      title: "",
      topic: "Can I disable App on my store?",
      description:
        "Yes, you can disable the App from Settings.",
      expand: false,
    },
    {
      title: "",
      topic: "What happens to a store when theme is updated?",
      description:
        "Yes, if we have done custom changes on your store's App. You might need to re-configure the app only if the theme is changed.",
      expand: false,
    },
  ];

  const toggleDropdown = (index) => {
    setFaqs((prevFaqs) => {
      const updatedFaqs = [...prevFaqs];
      updatedFaqs[index] = {
        ...updatedFaqs[index],
        expand: !updatedFaqs[index].expand,
      };
      return updatedFaqs;
    });
  };

  useEffect(() => {
    setFaqs(faqsObj);
  }, []);



  return (
    <Page title={<>FAQs{"  "}
      {navigation.state === "loading" ? (<span className="loader" style={{ marginLeft: "20px" }}><Spinner size="small" /></span>) : (<> </>)}</>} backAction={{ content: "Settings", url: "/app" }}>
      <Layout sectioned>
        <Divider borderColor="border" />
        <Layout.AnnotatedSection
          id="storeDetails"
          title="Frequently Asked Questions"
          description="Get answers to your questions"
        >
          <div className="faqs">
            <Card>
              {faqs.map((item, index) => (
                <div key={index}>
                  <b className="titleFaq">{item.title}</b>
                  <List type="bullet">
                    <List.Item>
                      <Link
                        onClick={() => toggleDropdown(index)}
                        ariaExpanded={item.expand}
                        ariaControls={`collapsible-${index}`}
                      >
                        <b>{item.topic}</b>
                      </Link>
                      <Collapsible
                        open={item.expand}
                        id={`collapsible-${index}`}
                        transition={{
                          duration: "500ms",
                          timingFunction: "ease-in-out",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        />
                      </Collapsible>
                    </List.Item>
                  </List>
                </div>
              ))}
            </Card>
          </div>
        </Layout.AnnotatedSection>

        <br />
        <Divider borderColor="border" />
        <Layout.AnnotatedSection
          id="help"
          title="Need Help?"
          description="Contact Us or click on Chat"
        >
          <Card>
            <Text variant="bodyMd" as="p">
              <b>
                For any query, feature requirement, or any assistance - do let
                us know!
              </b>
              <br />
              We are just a click away!
            </Text>
            <br />
            <ButtonGroup>
              <a
                style={{ textDecoration: "none" }}
                target="blank"
                href="https://www.oscprofessionals.com/oscp-upsell-cross-sell-app-support/"
              >
                <Button icon={ChatIcon}>Contact Us</Button>
              </a>
              <a
                style={{ textDecoration: "none" }}
                target="blank"
                href="mailto:apps@oscprofessionals.com"
              >
                <Button icon={EmailIcon}>Email Us</Button>
              </a>
            </ButtonGroup>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Footer />
    </Page>
  );
}
