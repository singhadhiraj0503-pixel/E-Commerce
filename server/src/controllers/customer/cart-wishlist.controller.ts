import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { ok } from "../../utils/envelope.js";
import { Cart } from "../../models/Cart.js";
import type {
  CartItem,
  CartPreviewItem,
  ProductPreview,
  SyncCartItemInput,
} from "../../types/types.js";
import { requireFound, requireText } from "../../utils/helpers.js";
import { AppError } from "../../utils/AppError.js";
import { Product, type ProductSize } from "../../models/Product.js";
import { Wishlist } from "../../models/Wishlist.js";
import type { Types } from "mongoose";

// helper functions

const getCartResponse = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId }).populate<{
    items: Array<{
      product: ProductPreview | null;
      quantity: number;
      color?: string;
      size?: string;
    }>;
  }>("items.product", "title brand price salePercentage images");

  const cartItems = cart?.items ?? [];

  const items = cartItems.flatMap((cartItem) => {
    if (!cartItem.product) return [];

    return [
      {
        ...formatProduct(cartItem.product),
        quantity: cartItem.quantity,
        color: cartItem.color,
        size: cartItem.size,
      },
    ];
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    totalQuantity,
  };
};

// const getCartResponse = async (userId: string) => {
//   const cart = await Cart.findOne({ user: userId }).populate(
//     "items.product",
//     "title brand price salePercentage images",
//   );

//   const cartItems = (cart?.items || []) as CartPreviewItem[];

//   const items = cartItems.flatMap((cartItem) => {
//     if (!cartItem.product) return [];

//     return [
//       {
//         ...formatProduct(cartItem.product),
//         quantity: cartItem.quantity,
//         color: cartItem.color,
//         size: cartItem.size,
//       },
//     ];
//   });

//   const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

//   return {
//     items,
//     totalQuantity,
//   };
// };

const formatProduct = (product: ProductPreview) => {
  const image =
    product.images.find((item) => item.isCover)?.url ||
    product.images[0]?.url ||
    "";

  const finalPrice = product.salePercentage
    ? Math.round(product.price - (product.price * product.salePercentage) / 100)
    : product.price;

  return {
    productId: String(product._id),
    title: product.title,
    brand: product.brand,
    image,
    finalPrice,
  };
};

const getSelectedVariant = (
  product: {
    colors: string[];
    sizes: ProductSize[];
  },
  colorValue: string,
  sizeValue: string,
) => {
  let color: string | undefined;
  let size: ProductSize | undefined;

  if (product.colors.length > 0) {
    if (!colorValue) {
      throw new AppError(400, "Color is required");
    }

    if (!product.colors.includes(colorValue)) {
      throw new AppError(400, "Selected color is invalid");
    }

    color = colorValue;
  }

  if (product.sizes.length > 0) {
    if (!sizeValue) {
      throw new AppError(400, "Size is required");
    }

    if (!product.sizes.includes(sizeValue as ProductSize)) {
      throw new AppError(400, "Selected size is invalid");
    }

    size = sizeValue as ProductSize;
  }

  return { color, size };
};

const isSameCartItem = (
  item: CartItem,
  productId: string,
  color?: string,
  size?: string,
) => {
  return (
    String(item.product) === productId &&
    (item.color || "") === (color || "") &&
    (item.size || "") === (size || "")
  );
};

const getWishlistResponse = async (userId: string) => {
  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "products",
    "title brand price salepercentage images",
  );

  const products = (wishlist?.products ||
    []) as unknown as Array<ProductPreview | null>;

  const items = products.flatMap((productItem) => {
    if (!productItem) return [];

    return [formatProduct(productItem)];
  });

  return { items };
};

// Cart Controllers
export const getCartItems = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    res.status(200).json(ok(await getCartResponse(String(dbUser._id))));
  },
);

export const postCartItems = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const productId = String(req.body.productId || "").trim();
    const quantity = Number(req.body.quantity || 1);
    const colorValue = String(req.body.color || "").trim();
    const sizeValue = String(req.body.size || "").trim();

    requireText(productId, "Product ID is required");

    if (Number.isNaN(quantity || quantity < 1)) {
      throw new AppError(400, "Quantity must be atleast 1");
    }

    const product = await Product.findOne({ _id: productId, status: "active" });

    const foundProduct = requireFound(product, "Product not found", 404);

    const { color, size } = getSelectedVariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    if (quantity > foundProduct.stock) {
      throw new AppError(
        400,
        "Quantity is more than the stock of this product",
      );
    }

    let cart = await Cart.findOne({ user: dbUser._id });

    if (!cart) {
      cart = await Cart.create({ user: dbUser._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item: CartItem) =>
      isSameCartItem(item, String(foundProduct._id), color, size),
    );

    // if (itemIndex > 0) {
    //   const nextQuantity = cart.items[itemIndex].quantity + quantity;

    //   if (nextQuantity > foundProduct.stock) {
    //     throw new AppError(
    //       400,
    //       "Quantity is more than the stock of this product",
    //     );
    //   }

    //   cart.items[itemIndex].quantity = nextQuantity;
    // } else {
    //   cart.items.push({
    //     product: foundProduct._id,
    //     quantity,
    //     color,
    //     size,
    //   });
    // }

    const existingItem = itemIndex >= 0 ? cart.items[itemIndex] : undefined;

    if (existingItem) {
      const nextQuantity = existingItem.quantity + quantity;

      if (nextQuantity > foundProduct.stock) {
        throw new AppError(
          400,
          "Quantity is more than the stock of this product",
        );
      }

      existingItem.quantity = nextQuantity;
    } else {
      cart.items.push({
        product: foundProduct._id,
        quantity,
        ...(color !== undefined ? { color } : {}),
        ...(size !== undefined ? { size } : {}),
      });
    }

    await cart.save();

    res.status(201).json(ok(await getCartResponse(String(dbUser._id))));
  },
);

export const increaseCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const productId = String(req.body.productId || "").trim();
    const colorValue = String(req.body.color || "").trim();
    const sizeValue = String(req.body.size || "").trim();

    requireText(productId, "Product ID is required");

    const cart = await Cart.findOne({ user: dbUser._id });
    const foundCart = requireFound(cart, "Cart not found", 404);

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    const foundProduct = requireFound(product, "Product not found", 404);

    const { color, size } = getSelectedVariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    const itemIndex = cart!.items.findIndex((item: CartItem) =>
      isSameCartItem(item, String(foundProduct._id), color, size),
    );

    if (itemIndex < 0) {
      throw new AppError(400, "Cart item not found here");
    }

    if (foundCart.items[itemIndex]!.quantity + 1 > foundProduct.stock) {
      throw new AppError(
        400,
        "Quantity is more than the stock of this product",
      );
    }

    foundCart.items[itemIndex]!.quantity += 1;

    await foundCart.save();

    res.status(200).json(ok(await getCartResponse(String(dbUser._id))));
  },
);

export const decreaseCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const productId = String(req.body.productId || "").trim();
    const colorValue = String(req.body.color || "").trim();
    const sizeValue = String(req.body.size || "").trim();

    requireText(productId, "Product ID is required");

    const cart = await Cart.findOne({ user: dbUser._id });
    const foundCart = requireFound(cart, "Cart not found", 404);

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    const foundProduct = requireFound(product, "Product not found", 404);

    const { color, size } = getSelectedVariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    const itemIndex = cart!.items.findIndex((item: CartItem) =>
      isSameCartItem(item, String(foundProduct._id), color, size),
    );

    if (itemIndex < 0) {
      throw new AppError(400, "Cart item not found here");
    }

    foundCart.items[itemIndex]!.quantity -= 1;

    if (foundCart.items[itemIndex]!.quantity <= 0) {
      foundCart.items.splice(itemIndex, 1);
    }

    await foundCart.save();

    res.status(200).json(ok(await getCartResponse(String(dbUser._id))));
  },
);

export const deleteCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const productId = String(req.body.productId || "").trim();
    const colorValue = String(req.body.color || "").trim();
    const sizeValue = String(req.body.size || "").trim();

    requireText(productId, "Product ID is required");

    const cart = await Cart.findOne({ user: dbUser._id });
    if (!cart) {
      res.status(200).json(ok({ items: [], totalQuantity: 0 }));
      return;
    }

    const product = await Product.findOne({ _id: productId, status: "active" });
    const foundProduct = requireFound(product, "Product not found", 404);

    const { color, size } = getSelectedVariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    cart.items = cart.items.filter(
      (item: CartItem) => !isSameCartItem(item, productId, color, size),
    );

    await cart.save();
    res.status(200).json(ok(await getCartResponse(String(dbUser._id))));
  },
);

export const cartSync = asyncHandler(async (req: Request, res: Response) => {
  const dbUser = await getDbUserFromReq(req);

  const incomingItems = Array.isArray(req.body.items)
    ? (req.body.items as SyncCartItemInput[])
    : [];

  let cart = await Cart.findOne({ user: dbUser._id });
  if (!cart) {
    cart = await Cart.create({ user: dbUser._id, items: [] });
  }

  for (const rawItem of incomingItems) {
    const productId = String(rawItem.productId || "").trim();
    const quantity = Number(rawItem.quantity || 0);
    const colorValue = String(rawItem.color || "").trim();
    const sizeValue = String(rawItem.size || "").trim();

    if (!productId || Number.isNaN(quantity) || quantity < 1) {
      continue;
    }

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    if (!product || product.stock < 1) {
      continue;
    }

    try {
      const { color, size } = getSelectedVariant(
        product,
        colorValue,
        sizeValue,
      );

      const itemIndex = cart.items.findIndex((item: CartItem) =>
        isSameCartItem(item, String(product._id), color, size),
      );

      if (itemIndex >= 0) {
        const nextQuantity = cart.items[itemIndex]!.quantity + quantity;

        cart.items[itemIndex]!.quantity = Math.min(nextQuantity, product.stock);
      } else {
        cart.items.push(
          //     {
          //   product: product._id,
          //   quantity: Math.min(quantity, product.stock),
          //   color,
          //   size,
          // }
          {
            product: product._id,
            quantity: Math.min(quantity, product.stock),
            ...(color !== undefined ? { color } : {}),
            ...(size !== undefined ? { size } : {}),
          },
        );
      }
    } catch {
      continue;
    }

    await cart.save();

    res.status(200).json(ok(await getCartResponse(String(dbUser._id))));
  }
});

// Wishlist Controllers
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const dbUser = await getDbUserFromReq(req);

  res.status(200).json(ok(await getWishlistResponse(String(dbUser._id))));
});

export const postWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const productId = String(req.body.productId || "").trim();

    requireText(productId, "Product id is required");

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    const foundProduct = requireFound(product, "Product not found", 404);

    let wishlist = await Wishlist.findOne({ user: dbUser._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: dbUser._id,
        products: [],
      });
    }

    const exists = wishlist.products.some(
      (item: Types.ObjectId) => String(item) === String(foundProduct._id),
    );

    if (!exists) {
      wishlist.products.push(foundProduct._id);
      await wishlist.save();
    }

    res.status(201).json(ok(await getWishlistResponse(String(dbUser._id))));
  },
);

export const deleteWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const productId = String(req.params.productId || "").trim();

    requireText(productId, "Product id is required");

    let wishlist = await Wishlist.findOne({ user: dbUser._id });
    if (!wishlist) {
      res.status(200).json(ok({ items: [] }));
      return;
    }

    wishlist.products = wishlist.products.filter(
      (item: Types.ObjectId) => String(item) !== productId,
    );

    await wishlist.save();
    res.status(200).json(ok(await getWishlistResponse(String(dbUser._id))));
  },
);
