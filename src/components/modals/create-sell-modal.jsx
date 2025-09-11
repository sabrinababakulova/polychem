import React, { useEffect, useState } from "react";
import { CreateDesign } from "./create-design";
import {
  getCustomers,
  getProducts,
  getCountries,
  getPurchases,
} from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { postSale } from "../../store/sales/post-sales";
import { random, some } from "lodash";
import { editSale } from "../../store/sales/edit-sale";
import { setError } from "../../store/get-notif";

export const CreateSellModal = ({ handleOpenSell, isEdit, selectedItem }) => {
  const { fetched: countriesFetched, data: countries } =
    useSelector(getCountries);
  const { fetched: purchaseFetched, data: purchases } =
    useSelector(getPurchases);
  const dispatch = useDispatch();
  const [file, setFile] = useState([]);
  const [subText, setSubText] = useState({
    step: 1,
    text: "Step 1/3: Adding main sale information",
  });
  const [secondaryBtnText, setSecondaryBtnText] = useState("Cancel");
  const { fetched: customersFetched, data: customers } =
    useSelector(getCustomers);
  const { fetched: productsFetched, data: products } = useSelector(getProducts);

  const [isDropZone, setIsDropZone] = useState(false);
  const [mainBtnText, setMainBtnText] = useState("Continue");
  const [orderNumber, setOrderNumber] = useState(
    selectedItem?.order_number || ""
  );
  const [country, setCountry] = useState(
    selectedItem?.country_name
      ? { label: selectedItem?.country_name, value: selectedItem?.country_id }
      : ""
  );
  const [customer, setCustomer] = useState(
    selectedItem?.customer_company_name
      ? {
          label: selectedItem?.customer_company_name,
          value: selectedItem?.customer_id,
        }
      : ""
  );
  const [product, setProduct] = useState(
    selectedItem?.pis?.[0]?.product_name
      ? { label: selectedItem?.pis?.[0]?.product_name }
      : ""
  );
  const [quantity, setQuantity] = useState(
    selectedItem?.insiderData?.["Quantity (Tons)"] || ""
  );
  const [saleType, setSaleType] = useState(
    selectedItem?.sale_type ? { label: selectedItem?.sale_type } : ""
  );
  const [pricePerTon, setPricePerTon] = useState(selectedItem?.price || "");
  const [paymentType, setPaymentType] = useState(
    selectedItem?.payment_type ? { label: selectedItem?.payment_type } : ""
  );
  const [paymentConditions, setPaymentConditions] = useState(
    selectedItem?.payment_condition
      ? { label: selectedItem?.payment_condition }
      : ""
  );
  const [deliveryCondition, setDeliveryCondition] = useState(
    selectedItem?.delivery_condition
      ? { label: selectedItem?.delivery_condition }
      : ""
  );
  const [paymentDate, setPaymentDate] = useState(
    selectedItem?.payment_date || ""
  );
  const [outOfStockReminder, setOutOfStockReminder] = useState(
    selectedItem?.out_of_stock_reminder || ""
  );
  const [createdAt, setCreatedAt] = useState(selectedItem?.created_at || "");
  const [items, setItems] = useState([
    {
      id: 1,
      label: "Order number",
      isInput: true,
      value: orderNumber,
      onChange: (e) => setOrderNumber(e.target.value),
      placeholder: "Enter Order Number",
    },
    {
      id: 12,
      label: "Country",
      items: countries,
      value: country,
      onChange: (e) => setCountry(e),
      placeholder: "Pick Country",
    },
    {
      id: 2,
      label: "Customer",
      placeholder: "Pick a customer",
      value: customer,
      onChange: (e) => setCustomer(e),
      items: customers.map((item) => ({
        id: item.id,
        name: item.company_name,
      })),
    },
    {
      id: 3,
      label: "Product",
      value: product,
      onChange: (e) => setProduct(e),
      items: products,
      placeholder: "Enter and pick a product",
    },
    {
      id: 4,
      label: "Quantity",
      value: quantity,
      onChange: (e) => setQuantity(e.target.value),
      isInput: true,
      placeholder: "Enter quantity in tons",
    },
    {
      id: 5,
      label: "Sale type",
      value: saleType,
      onChange: (e) => setSaleType(e),
      items: [
        {
          name: "Order",
          id: 1,
        },
        {
          name: "Sale",
          id: 2,
        },
      ],
    },
    {
      id: 6,
      label: "Price per ton",
      isInput: true,
      value: pricePerTon,
      onChange: (e) => setPricePerTon(e.target.value),
      placeholder: "Enter price per ton",
    },
    {
      id: 7,
      label: "Payment type",
      items: [
        {
          name: "Cash",
          id: 1,
        },
        {
          name: "Bank Transfer",
          id: 2,
        },
      ],
      value: paymentType,
      onChange: (e) => setPaymentType(e),
    },
    {
      id: 8,
      label: "Payment conditions",
      items: [
        {
          name: "Debt",
          id: 1,
        },
        {
          name: "Prepayment",
          id: 2,
        },
        {
          name: "Full payment",
          id: 3,
        },
      ],
      value: paymentConditions,
      onChange: (e) => setPaymentConditions(e),
    },
    {
      id: 9,
      label: "Delivery condition",
      onChange: (e) => setDeliveryCondition(e),
      items: [
        { name: "FCA", id: 1 },
        { name: "CIP", id: 2 },
        { name: "DDP", id: 3 },
        { name: "FOB", id: 4 },
        { name: "CFR", id: 5 },
        { name: "CIF", id: 6 },
        { name: "FCA Export", id: 7 },
        { name: "CIP Export", id: 8 },
      ],
      value: deliveryCondition,
    },
    {
      id: 10,
      label: "Payment date",
      onChange: (e) => setPaymentDate(e),
      isCalendar: true,
      isInput: true,
      value: paymentDate,
      placeholder: "Pick payment date",
    },
    {
      id: 11,
      label: "Out of stock reminer",
      isCalendar: true,
      isInput: true,
      value: outOfStockReminder,
      onChange: (e) => setOutOfStockReminder(e),
      placeholder: "Pick out of stock reminder date",
    },
    {
      id: 13,
      label: "Created at",
      isCalendar: true,
      isInput: true,
      value: createdAt,
      onChange: (e) => setCreatedAt(e),
      placeholder: "Pick creation date",
    },
  ]);

  const [pis, setPis] = useState([
    {
      pi: 1,
      piNumber: {},
      quantity: "",
    },
  ]);
  const [secondStep, setSecondStep] = useState([
    {
      id: 1,
      label: "PI #1",
      items: purchases
        ?.filter(
          (item) =>
            item?.product_id === product?.value ||
            item?.product_name === product?.label
        )
        ?.map((each) => ({ name: each?.pi, id: each?.id })),
      placeholder: "Enter PI#",
      isDeleteEnabled: true,
      piId: 1,
      pi: 1,
      onChange: (e) =>
        setPis((prev) =>
          prev.map((item) => (item.pi === 1 ? { ...item, piNumber: e } : item))
        ),
      value: pis[0]?.piNumber,
    },
    {
      id: 2,
      piId: 2,
      label: "PI #1 Quantity",
      isInput: true,
      placeholder: "Enter Quantity",
      pi: 1,
      onChange: (e) =>
        setPis((prev) =>
          prev.map((item) =>
            item.pi === 1 ? { ...item, quantity: e.target.value } : item
          )
        ),
      value: pis[0]?.quantity,
    },
  ]);
  const [hasPisFinished, setHasPisFinished] = useState(false);
  useEffect(() => {
    const actPIs = selectedItem?.pis?.map((item, index) => ({
      pi: index + 1,
      piNumber: { label: item?.pi },
      quantity: item?.quantity,
    }));
    const secondTempStep = actPIs?.map((item, index) => [
      {
        id: random(1, 1000),
        label: `PI #${index + 1}`,
        pi: index + 1,
        items: purchases
          ?.filter(
            (item) =>
              item?.product_id === product?.value ||
              item?.product_name === product?.label
          )
          ?.map((each) => ({ name: each?.pi, id: each?.id })),
        placeholder: "Enter PI#",
        piId: 1,
        isDeleteEnabled: true,
        onChange: (e) =>
          setPis((prev) =>
            prev.map((each) =>
              each.pi === item?.pi ? { ...each, piNumber: e } : each
            )
          ),
        value: item?.piNumber,
      },
      {
        id: random(1, 1000),
        label: `PI #${index + 1} Quantity`,
        isInput: true,
        piId: 2,
        pi: index + 1,
        placeholder: "Enter Quantity",
        onChange: (e) =>
          setPis((prev) =>
            prev.map((each) =>
              each.pi === item?.pi
                ? { ...each, quantity: e.target.value }
                : each
            )
          ),
        value: item?.quantity,
      },
    ]);
    if (secondTempStep?.length > 0) {
      setPis(actPIs);
      setSecondStep(secondTempStep?.[0]);
    }
    setHasPisFinished(true);
  }, [selectedItem, purchases]);
  const addPi = () => {
    setPis((prev) => [
      ...prev,
      { pi: prev.length + 1, piNumber: "", quantity: "" },
    ]);
    const newInput = {
      id: secondStep.length + 1,
      label: `PI #${pis.length + 1}`,
      items: purchases
        ?.filter(
          (item) =>
            item?.product_id === product?.value ||
            item?.product_name === product?.label
        )
        ?.map((each) => ({ name: each?.pi, id: each?.id })),
      piId: 1,
      placeholder: "Enter PI#",
      isDeleteEnabled: true,
      pi: pis.length + 1,
      onChange: (e) =>
        setPis((prev) =>
          prev.map((item) =>
            item.pi === pis.length + 1 ? { ...item, piNumber: e } : item
          )
        ),
      value: pis[pis?.length]?.piNumber,
    };
    const newInputQuantity = {
      id: secondStep.length + 2,
      label: `PI #${pis.length + 1} Quantity`,
      isInput: true,
      piId: 2,
      placeholder: "Enter Quantity",
      pi: pis.length + 1,
      onChange: (e) =>
        setPis((prev) =>
          prev.map((item) =>
            item.pi === pis.length + 1
              ? { ...item, quantity: e.target.value }
              : item
          )
        ),
      value: pis[pis?.length]?.quantity,
    };
    setSecondStep((prev) => [...prev, newInput, newInputQuantity]);
  };

  const deletePi = (pi) => {
    setPis((prev) => prev.filter((item) => item.pi !== pi));
    setSecondStep((prev) => prev.filter((item) => item.pi !== pi));
  };

  // working on second step
  useEffect(() => {
    if (hasPisFinished) {
      setSecondStep((prev) => {
        return prev?.map((item) => {
          const temp = pis?.find((each) => each?.pi === item?.pi);
          if (item.piId === 1)
            return {
              ...item,
              items: purchases
                ?.filter(
                  (purchase) =>
                    purchase?.product_id === product?.value ||
                    purchase?.product_name === product?.label
                )
                ?.map((each) => ({ name: each?.pi, id: each?.id })),
              value: temp?.piNumber,
            };
          if (item.piId === 2)
            return {
              ...item,
              value: temp?.quantity,
            };
          return item;
        });
      });
    }
  }, [pis, product, hasPisFinished]);

  // working on first step
  useEffect(() => {
    setItems((prev) =>
      prev?.map((item) => {
        if (item.id === 1) return { ...item, value: orderNumber };
        if (item.id === 2) return { ...item, value: customer };
        if (item.id === 3) return { ...item, value: product };
        if (item.id === 4) return { ...item, value: quantity };
        if (item.id === 5) return { ...item, value: saleType };
        if (item.id === 6) return { ...item, value: pricePerTon };
        if (item.id === 7) return { ...item, value: paymentType };
        if (item.id === 8) return { ...item, value: paymentConditions };
        if (item.id === 9) return { ...item, value: deliveryCondition };
        if (item.id === 10) return { ...item, value: paymentDate };
        if (item.id === 11) return { ...item, value: outOfStockReminder };
        if (item.id === 12) return { ...item, value: country };
        if (item.id === 13) return { ...item, value: createdAt };
        return item;
      })
    );
  }, [
    orderNumber,
    customer,
    country,
    createdAt,
    product,
    quantity,
    saleType,
    pricePerTon,
    paymentType,
    paymentConditions,
    deliveryCondition,
    paymentDate,
    outOfStockReminder,
  ]);

  const handleContinue = () => {
    if (subText.step === 1) {
      if (
        !isEdit &&
        (!customer ||
          !product ||
          !quantity ||
          !saleType ||
          !pricePerTon ||
          !paymentType ||
          !paymentConditions ||
          !deliveryCondition ||
          !paymentDate ||
          !outOfStockReminder ||
          !country)
      )
        return dispatch(setError("Fill all fields"));
      setSubText({
        step: 2,
        text: "Step 2/3: Choosing PIs",
      });
      setSecondaryBtnText("Back");
    }
    if (subText.step === 2) {
      const hasEmptyValues = (array) => {
        return some(array, (obj) => {
          return !obj.piNumber || !obj.quantity;
        });
      };
      if (hasEmptyValues(pis)) return dispatch(setError("Fill all the pi#"));
      if (isEdit) {
        dispatch(
          editSale({
            orderNumber,
            createdAt,
            customerId: customer,
            quantity,
            saleType: saleType?.label,
            pricePerTon,
            paymentType: paymentType?.label,
            paymentConditions: paymentConditions?.label,
            deliveryCondition: deliveryCondition?.label,
            paymentDate,
            outOfStockReminder,
            purchaseId: product,
            pis,
            country,
            itemId: selectedItem?.id,
            file,
            createdAt,
          })
        );
        handleOpenSell();
      } else {
        setSubText({
          step: 3,
          text: "Step 3/3: Attach documents",
        });
        setIsDropZone(true);
        setMainBtnText("Create");
      }
    }
    if (subText.step === 3) {
      dispatch(
        postSale({
          country,
          orderNumber,
          customerId: customer,
          quantity,
          saleType: saleType?.label,
          pricePerTon,
          paymentType: paymentType?.label,
          paymentConditions: paymentConditions?.label,
          deliveryCondition: deliveryCondition?.label,
          paymentDate,
          outOfStockReminder,
          purchaseId: product,
          pis,
          file,
          createdAt,
        })
      );
      handleOpenSell();
    }
  };
  const handleCancelBtn = () => {
    if (subText.step === 1) {
      handleOpenSell();
    }
    if (subText.step === 2) {
      setSubText({
        step: 1,
        text: "Step 1/3: Adding main sale information",
      });
      setSecondaryBtnText("Cancel");
    }
    if (subText.step === 3) {
      setSubText({
        step: 2,
        text: "Step 2/3: Choosing PIs",
      });
      setIsDropZone(false);
      setMainBtnText("Continue");
      setSecondaryBtnText("Back");
    }
  };
  const handleDeleteFile = (index) =>
    setFile((prev) => prev.filter((_, i) => i !== index));

  return (
    <CreateDesign
      loading={
        !countriesFetched ||
        !customersFetched ||
        !productsFetched ||
        !purchaseFetched
      }
      subText={subText}
      modalTitle="Sell"
      items={subText?.step === 1 ? items : secondStep}
      isAddPI={subText.step === 2}
      onAddPi={addPi}
      handleClose={handleCancelBtn}
      cancelBtnText={secondaryBtnText}
      onDeleteInput={subText?.step === 2 && pis?.length > 1 && deletePi}
      handleContinue={handleContinue}
      mainBtnText={mainBtnText}
      isDropZone={isDropZone}
      file={file}
      handleDeleteFile={handleDeleteFile}
      setFile={setFile}
    />
  );
};
