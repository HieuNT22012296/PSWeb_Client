import React, { useEffect, useRef, useState } from "react";
// import { WrapperHeader } from './style'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Select, Space, Upload } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
// import { WrapperUploadFile } from '../../pages/Profile/style'
import { convertPrice, getBase64, renderOptions } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
// import Loading from '../Loading/Loading'
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const ProductManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [categorySelect, setCategorySelect] = useState("");
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const initial = () => ({
    name: "",
    category: "",
    price: "",
    inventory: "",
    rating: "",
    description: "",
    image: "",
    newCategory: "",
    discount: "",
  });

  const [stateProduct, setStateProduct] = useState(initial());

  const [stateProductDetails, setStateProductDetails] = useState(initial());

  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const {
      name,
      category,
      price,
      inventory,
      rating,
      discount,
      description,
      image,
    } = data;
    const res = ProductService.createProduct({
      name,
      category,
      price,
      inventory,
      rating,
      discount,
      description,
      image,
    });
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, ...rests } = data;
    const res = ProductService.updateProduct(id, { ...rests });
    return res;
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id } = data;
    const res = ProductService.deleteProduct(id);
    return res;
  });

  const mutationDeleteMany = useMutationHooks((data) => {
    const { ...ids } = data;
    // const res = ProductService.deleteManyProduct(ids);
    return true;
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllProducts();
    return res
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getProductByID(rowSelected);
    if (res?.id) {
      setStateProductDetails({
        name: res?.name,
        category: res?.category,
        price: res?.price,
        inventory: res?.inventory,
        rating: res?.rating,
        description: res?.description,
        image: res?.image,
        discount: res?.discount,
      });
    }
    setIsLoadingUpdate(false);
  };

  // const fetchAllCategoryProduct = async () => {
  //   const res = await ProductService.getAllCategoryProduct();
  //   return res;
  // };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(initial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleDeleteManyProduct = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const { data, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;
  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;

  // const categoryProduct = useQuery({
  //   queryKey: ["category-products"],
  //   queryFn: fetchAllCategoryProduct,
  // });

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "blue", fontSize: "20px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 15.000.000",
          value: ">=",
        },
        {
          text: "<= 25.000.000",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 15000000;
        }
        return record.price <= 25000000;
      },
      render: (price) => convertPrice(price),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 5",
          value: ">=",
        },
        {
          text: "<= 4",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.rating >= 5;
        }
        return record.rating <= 4;
      },
    },
    {
      title: "Selled",
      dataIndex: "selled",
      sorter: (a, b) => a.selled - b.selled,
      filters: [
        {
          text: ">= 100",
          value: ">=",
        },
        {
          text: "<= 10",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.selled >= 100;
        }
        return record.selled <= 10;
      },
    },
    {
      title: "Inventory",
      dataIndex: "inventory",
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      render: (updatedAt) => formatDate(updatedAt),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const dataTable =
    products?.length &&
    products?.map((product) => {
      return { ...product, key: product.id};
    });

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessUpdated) {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  useEffect(() => {
    console.log(isSuccessDeleted)
    if (isSuccessDeleted) {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      category: "",
      price: "",
      inventory: "",
      rating: "",
      description: "",
      image: "",
      discount: "",
    });
    form.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      category: "",
      price: "",
      inventory: "",
      rating: "",
      description: "",
      image: "",
      discount: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      inventory: stateProduct.inventory,
      discount: stateProduct.discount,
      category: stateProduct.category
        // stateProduct.category === "add_category"
        //   ? stateProduct.newCategory
        //   : stateProduct.category,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, ...stateProductDetails },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleOnChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      // category: value,
    });
  };

  return (
    <div>
      <h3>Product Management</h3>
      <div style={{ marginTop: "30px" }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "35px" }} />
        </Button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyProduct}
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record.id);
              },
            };
          }}
        />
        <ModalComponent
          forceRender
          title="Create Product"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          {/* <Loading isLoading={isLoading}> */}
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="NAME"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProduct.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="CATEGORY"
              name="category"
              rules={[
                { required: false, message: "Please input your category!" },
              ]}
            >
              <Select
                name="category"
                value={stateProduct.category}
                onChange={handleOnChangeSelect}
                // options={renderOptions(categoryProduct?.data?.data)}
              />
            </Form.Item>
            {stateProduct.category === "add_category" && (
              <Form.Item
                style={{marginLeft: '-9px'}}
                label="NEW CATEGORY"
                name="new"
                rules={[
                  { required: true, message: "Please input your category!" },
                ]}
              >
                <InputComponent
                  style={{marginLeft: '7px', width: '355px'}}
                  value={stateProduct.newCategory}
                  onChange={handleOnChange}
                  name="newCategory"
                />
              </Form.Item>
            )}

            <Form.Item
              label="PRICE"
              name="price"
              rules={[{ required: true, message: "Please input your price!" }]}
            >
              <InputComponent
                value={stateProductDetails?.price?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
                onChange={handleOnChange}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="INVENTORY"
              name="inventory"
              rules={[
                { required: true, message: "Please input your inventory!" },
              ]}
            >
              <InputComponent
                value={stateProduct.inventory}
                onChange={handleOnChange}
                name="inventory"
              />
            </Form.Item>

            <Form.Item
              label="RATING"
              name="rating"
              rules={[{ required: true, message: "Please input your rating!" }]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleOnChange}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="DISCOUNT"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount of product!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnChange}
                name="discount"
              />
            </Form.Item>

            <Form.Item
              label="DESCRIPTION"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="IMAGE"
              name="image"
              rules={[{ required: true, message: "Please input your image!" }]}
            >
              <Upload onChange={handleOnChangeAvatar} maxCount={1}>
                <Button style={{ marginLeft: "100px", display: "flex" }}>
                  Select image
                </Button>
                {stateProduct?.image && (
                  <img
                    src={stateProduct?.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "115px",
                      marginTop: "10px",
                    }}
                    alt="avatar"
                  />
                )}
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          {/* </Loading> */}
        </ModalComponent>

        <DrawerComponent
          title="Product Details"
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          width="50%"
        >
          {/* <Loading isLoading={isLoadingUpdate || isLoadingUpdated}> */}
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            onFinish={onUpdateProduct}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="NAME"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="CATEGORY"
              name="category"
              rules={[
                { required: true, message: "Please input your category!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.category}
                onChange={handleOnChangeDetails}
                name="category"
              />
            </Form.Item>

            <Form.Item
              label="PRICE"
              name="price"
              rules={[{ required: true, message: "Please input your price!" }]}
            >
              <InputComponent
                value={stateProductDetails?.price}
                onChange={handleOnChangeDetails}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Inventory"
              name="inventory"
              rules={[
                { required: true, message: "Please input your count InStock!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.inventory}
                onChange={handleOnChangeDetails}
                name="inventory"
              />
            </Form.Item>

            {/* <Form.Item
              label="RATING"
              name="rating"
              rules={[{ required: true, message: "Please input your rating!" }]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnChangeDetails}
                name="rating"
              />
            </Form.Item> */}

            <Form.Item
              label="DISCOUNT"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount of product!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleOnChangeDetails}
                name="discount"
              />
            </Form.Item>

            <Form.Item
              label="DESCRIPTION"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="IMAGE"
              name="image"
              rules={[{ required: true, message: "Please input your image!" }]}
            >
              <Upload onChange={handleOnChangeAvatarDetails} maxCount={1}>
                <Button
                  style={{
                    marginLeft: "170px",
                    marginBottom: "10px",
                    display: "flex",
                  }}
                >
                  Select image
                </Button>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails?.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "185px",
                      marginTop: "10px",
                    }}
                    alt="avatar"
                  />
                )}
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 13, span: 16 }}>
              <Button
                style={{ margin: "5px" }}
                type="primary"
                htmlType="submit"
              >
                Apply
              </Button>
            </Form.Item>
          </Form>
          {/* </Loading> */}
        </DrawerComponent>
        <ModalComponent
          title="Xóa Sản Phẩm"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteProduct}
        >
          {/* <Loading isLoading={isLoadingDeleted}> */}
          <div>Are You Sure To Delete This Product?</div>
          {/* </Loading> */}
        </ModalComponent>
      </div>
    </div>
  );
};

export default ProductManager;
