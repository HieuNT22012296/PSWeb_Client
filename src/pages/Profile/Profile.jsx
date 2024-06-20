import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/Slice/UserSlice";
import { Button, Upload, Input, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import { Navbar } from "../../components/navbar";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [city, setCity] = useState("");

  const mutation = useMutationHooks((data) => {
    const { id, ...rests } = data;
    return UserService.updateUser(id, rests);
  });

  const dispatch = useDispatch();
  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (user?.id) {
      handleGetDetailsUser(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isSuccess) {
      message.success("Profile updated successfully!");
      handleGetDetailsUser(user?.id);
    } else if (isError) {
      message.error("Error updating profile.");
    }
  }, [isSuccess, isError]);

  const handleGetDetailsUser = async (id) => {
    const res = await UserService.getDetailsUser(id);
    const userData = res?.data;
    if (userData) {
      dispatch(updateUser(userData));
      setName(userData.name);
      setEmail(userData.email);
      setPhone(userData.phone);
      setAddress(userData.address);
      setAvatar(userData.avatar);
      setCity(userData.city);
    }
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setAvatar(file.preview);
    }
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      name,
      email,
      phone,
      address,
      avatar,
      city
    });
  };
  return (
    <section className="h-100 gradient-custom-2">
      <Navbar isHiddenSearch isHiddenCart />
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center">
          <div className="col col-lg-9 col-xl-8">
            <div className="card">
              <div
                className="rounded-top text-white d-flex flex-row"
                style={{ backgroundColor: "#000", height: 200 }}
              >
                <div
                  className="ms-4 mt-5 d-flex flex-column"
                  style={{ width: 150 }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="img-fluid img-thumbnail mt-4 mb-5"
                      style={{ width: 150, zIndex: 1}}
                    />
                  ) : (
                    <img
                      src="https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_640.png"
                      alt="Generic placeholder image"
                      className="img-fluid img-thumbnail mt-4 mb-2"
                      style={{ width: 150, zIndex: 1 }}
                    />
                  )}
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleOnchangeAvatar}
                  >
                    <Button
                      type="button"
                      data-mdb-button-init=""
                      data-mdb-ripple-init=""
                      className="btn btn-outline-dark text-body text-center-btn" 
                      data-mdb-ripple-color="dark"
                      style={{ zIndex: 1 }}
                    >
                      Edit profile
                    </Button>
                  </Upload>
                </div>
                <div className="ms-3" style={{ marginTop: 110 }}>
                  <h5>{name || "User Name"}</h5>
                  <p>{email || "User Email"}</p>
                </div>
              </div>
              <div className="p-4 text-black bg-body-tertiary">
                <div className="d-flex justify-content-end text-center py-1 text-body">
                  <div>
                    <p className="mb-1 h5">253</p>
                    <p className="small text-muted mb-0">Photos</p>
                  </div>
                  <div className="px-3">
                    <p className="mb-1 h5">1026</p>
                    <p className="small text-muted mb-0">Followers</p>
                  </div>
                  <div>
                    <p className="mb-1 h5">478</p>
                    <p className="small text-muted mb-0">Following</p>
                  </div>
                </div>
              </div>
              <div className="card-body p-4 text-black">
                <div className="mb-5  text-body">
                  <p className="lead fw-normal mb-1">About</p>
                  <div className="p-4 bg-body-tertiary">
                  <Form layout="vertical" onFinish={handleUpdate}>
                      <Form.Item label="Name">
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Email">
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Phone">
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Address">
                        <Input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="City">
                        <Input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="custom-update-button"
                      >
                        Update
                      </Button>
                    </Form>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4 text-body">
                  <p className="lead fw-normal mb-0">Recent photos</p>
                  <p className="mb-0">
                    <a href="#!" className="text-muted">
                      Show all
                    </a>
                  </p>
                </div>
                <div className="row g-2">
                  <div className="col mb-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                      alt="image 1"
                      className="w-100 rounded-3"
                    />
                  </div>
                  <div className="col mb-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                      alt="image 1"
                      className="w-100 rounded-3"
                    />
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                      alt="image 1"
                      className="w-100 rounded-3"
                    />
                  </div>
                  <div className="col">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                      alt="image 1"
                      className="w-100 rounded-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
