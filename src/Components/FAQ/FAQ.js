import "./FAQ.css";
import React, { useState } from "react";

const dataCollection = [
  {
    question: "How does ParkVue work for users looking to rent a parking spot???",
    answer:
      "ParkVue makes it easy for users to find and rent nearby parking spots. Simply search for available spots on the app, choose the one that suits your needs, and complete the booking process. You will receive instructions on how to access the parking spot, and your payment is securely handled through the app.",
  },
  {
    question: "Can I trust the accuracy of parking spot listings on ParkVue?",
    answer:
      "Yes, you can! All parking spot listings on ParkVue are verified by our team. We ensure that the information, pricing, and location details are accurate and up-to-date for a seamless rental experience.",
  },
  {
    question: "How do I list my own parking spot on ParkVue as a space owner?",
    answer:
      "Listing your parking spot is easy. Sign up as a space owner on ParkVue, provide details about your spot, set your desired pricing, and upload photos. Once your listing is approved, it will be visible to users searching for parking in your area.",
  },
  {
    question: "What payment methods are accepted on ParkVue?",
    answer:
      "ParkVue accepts a variety of payment methods, including major credit cards and digital payment options. We use secure payment processing to protect your financial information.",
  },
  {
    question:
      "Can I rent a parking spot on a long-term basis, such as monthly or annually?",
    answer:
      "Yes, you can rent parking spots for various durations, including daily, weekly, monthly, or even annually. The choice is yours, and many parking space owners offer flexible rental options.",
  },
  {
    question:
      "How do I ensure the safety and security of my vehicle when renting a parking spot on ParkVue?",
    answer:
      "ParkVue prioritizes user safety. We recommend renting spots from verified owners with positive reviews. Additionally, parking spots are often located in safe and monitored areas, providing added security for your vehicle.",
  },
  {
    question: "What if I have an issue or need assistance while using ParkVue?",
    answer:
      "We are here to help! ParkVue offers customer support to assist you with any questions or concerns. You can reach out to our support team through the app, and we will do our best to resolve your issues promptly.",
  },
];

function FAQ() {
  const [accordion, setActiveAccordion] = useState(-1);
  function toggleAccordion(index) {
    if (index === accordion) {
      setActiveAccordion(-1);
      return;
    }
    setActiveAccordion(index);
  }

  return (
    <>
      <div className="container">
        <div>
          <span className="accordion__title">Frequently asked questions</span>
          <h4>Let's answer some of your questions</h4>
        </div>
        <div className="accordion__faq">
          {dataCollection.map((item, index) => (
            <div key={index}>
              <div
                className={`accordion__faq-heading ${
                  accordion === index ? "active" : ""
                }`}
                onClick={() => toggleAccordion(index)}
              >
                <h3>{item.question}</h3>
                <div>
                  {accordion === index ? (
                    <span className="verticle">-</span>
                  ) : (
                    <span className="horizental">+</span>
                  )}
                </div>
              </div>
              <div
                className={`accordion__faq-content ${
                  accordion === index ? "active" : "inactive"
                }`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FAQ;
