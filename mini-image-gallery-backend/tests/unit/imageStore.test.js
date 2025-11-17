const imageStore = require("../../utils/imageStore");

describe("ImageStore Unit Tests", () => {

  beforeEach(() => {
    imageStore.clear();
  });

  test("should add and retrieve an image", () => {
    imageStore.add("123", { id: "123", name: "test.jpg" });

    const img = imageStore.get("123");
    expect(img).toEqual({ id: "123", name: "test.jpg" });
  });

  test("should list images", () => {
    imageStore.add("1", { id: "1" });
    imageStore.add("2", { id: "2" });

    const list = imageStore.list();
    expect(list.length).toBe(2);
  });

  test("should delete an image", () => {
    imageStore.add("1", { id: "1" });
    expect(imageStore.delete("1")).toBe(true);
    expect(imageStore.get("1")).toBe(undefined);
  });

  test("should return false for deleting non-existing image", () => {
    expect(imageStore.delete("999")).toBe(false);
  });
});
