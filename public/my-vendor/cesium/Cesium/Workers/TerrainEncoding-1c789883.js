/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.97
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
define([
  "exports",
  "./Transforms-0c3fa360",
  "./Matrix2-276d97d2",
  "./defaultValue-a6eb9f34",
  "./AttributeCompression-28a6d524",
  "./ComponentDatatype-7f6d9570",
], function (t, e, i, o, a, r) {
  "use strict";
  function n(t, e) {
    (this._ellipsoid = t),
      (this._cameraPosition = new i.Cartesian3()),
      (this._cameraPositionInScaledSpace = new i.Cartesian3()),
      (this._distanceToLimbInScaledSpaceSquared = 0),
      o.defined(e) && (this.cameraPosition = e);
  }
  Object.defineProperties(n.prototype, {
    ellipsoid: {
      get: function () {
        return this._ellipsoid;
      },
    },
    cameraPosition: {
      get: function () {
        return this._cameraPosition;
      },
      set: function (t) {
        const e = this._ellipsoid.transformPositionToScaledSpace(
            t,
            this._cameraPositionInScaledSpace
          ),
          o = i.Cartesian3.magnitudeSquared(e) - 1;
        i.Cartesian3.clone(t, this._cameraPosition),
          (this._cameraPositionInScaledSpace = e),
          (this._distanceToLimbInScaledSpaceSquared = o);
      },
    },
  });
  const s = new i.Cartesian3();
  (n.prototype.isPointVisible = function (t) {
    return x(
      this._ellipsoid.transformPositionToScaledSpace(t, s),
      this._cameraPositionInScaledSpace,
      this._distanceToLimbInScaledSpaceSquared
    );
  }),
    (n.prototype.isScaledSpacePointVisible = function (t) {
      return x(
        t,
        this._cameraPositionInScaledSpace,
        this._distanceToLimbInScaledSpaceSquared
      );
    });
  const c = new i.Cartesian3();
  (n.prototype.isScaledSpacePointVisiblePossiblyUnderEllipsoid = function (
    t,
    e
  ) {
    const i = this._ellipsoid;
    let a, r;
    return (
      o.defined(e) && e < 0 && i.minimumRadius > -e
        ? ((r = c),
          (r.x = this._cameraPosition.x / (i.radii.x + e)),
          (r.y = this._cameraPosition.y / (i.radii.y + e)),
          (r.z = this._cameraPosition.z / (i.radii.z + e)),
          (a = r.x * r.x + r.y * r.y + r.z * r.z - 1))
        : ((r = this._cameraPositionInScaledSpace),
          (a = this._distanceToLimbInScaledSpaceSquared)),
      x(t, r, a)
    );
  }),
    (n.prototype.computeHorizonCullingPoint = function (t, e, i) {
      return h(this._ellipsoid, t, e, i);
    });
  const d = i.Ellipsoid.clone(i.Ellipsoid.UNIT_SPHERE);
  (n.prototype.computeHorizonCullingPointPossiblyUnderEllipsoid = function (
    t,
    e,
    i,
    o
  ) {
    return h(m(this._ellipsoid, i, d), t, e, o);
  }),
    (n.prototype.computeHorizonCullingPointFromVertices = function (
      t,
      e,
      i,
      o,
      a
    ) {
      return p(this._ellipsoid, t, e, i, o, a);
    }),
    (n.prototype.computeHorizonCullingPointFromVerticesPossiblyUnderEllipsoid =
      function (t, e, i, o, a, r) {
        return p(m(this._ellipsoid, a, d), t, e, i, o, r);
      });
  const u = [];
  n.prototype.computeHorizonCullingPointFromRectangle = function (t, o, a) {
    const r = i.Rectangle.subsample(t, o, 0, u),
      n = e.BoundingSphere.fromPoints(r);
    if (!(i.Cartesian3.magnitude(n.center) < 0.1 * o.minimumRadius))
      return this.computeHorizonCullingPoint(n.center, r, a);
  };
  const l = new i.Cartesian3();
  function m(t, e, a) {
    if (o.defined(e) && e < 0 && t.minimumRadius > -e) {
      const o = i.Cartesian3.fromElements(
        t.radii.x + e,
        t.radii.y + e,
        t.radii.z + e,
        l
      );
      t = i.Ellipsoid.fromCartesian3(o, a);
    }
    return t;
  }
  function h(t, e, a, r) {
    o.defined(r) || (r = new i.Cartesian3());
    const n = M(t, e);
    let s = 0;
    for (let e = 0, i = a.length; e < i; ++e) {
      const i = g(t, a[e], n);
      if (i < 0) return;
      s = Math.max(s, i);
    }
    return y(n, s, r);
  }
  const f = new i.Cartesian3();
  function p(t, e, a, r, n, s) {
    o.defined(s) || (s = new i.Cartesian3()),
      (r = o.defaultValue(r, 3)),
      (n = o.defaultValue(n, i.Cartesian3.ZERO));
    const c = M(t, e);
    let d = 0;
    for (let e = 0, i = a.length; e < i; e += r) {
      (f.x = a[e] + n.x), (f.y = a[e + 1] + n.y), (f.z = a[e + 2] + n.z);
      const i = g(t, f, c);
      if (i < 0) return;
      d = Math.max(d, i);
    }
    return y(c, d, s);
  }
  function x(t, e, o) {
    const a = e,
      r = o,
      n = i.Cartesian3.subtract(t, a, s),
      c = -i.Cartesian3.dot(n, a);
    return !(r < 0
      ? c > 0
      : c > r && (c * c) / i.Cartesian3.magnitudeSquared(n) > r);
  }
  const S = new i.Cartesian3(),
    C = new i.Cartesian3();
  function g(t, e, o) {
    const a = t.transformPositionToScaledSpace(e, S);
    let r = i.Cartesian3.magnitudeSquared(a),
      n = Math.sqrt(r);
    const s = i.Cartesian3.divideByScalar(a, n, C);
    (r = Math.max(1, r)), (n = Math.max(1, n));
    const c = 1 / n;
    return (
      1 /
      (i.Cartesian3.dot(s, o) * c -
        i.Cartesian3.magnitude(i.Cartesian3.cross(s, o, s)) *
          (Math.sqrt(r - 1) * c))
    );
  }
  function y(t, e, o) {
    if (!(e <= 0 || e === 1 / 0 || e != e))
      return i.Cartesian3.multiplyByScalar(t, e, o);
  }
  const N = new i.Cartesian3();
  function M(t, e) {
    return i.Cartesian3.equals(e, i.Cartesian3.ZERO)
      ? e
      : (t.transformPositionToScaledSpace(e, N), i.Cartesian3.normalize(N, N));
  }
  const T = {
      getHeight: function (t, e, i) {
        return (t - i) * e + i;
      },
    },
    b = new i.Cartesian3();
  T.getPosition = function (t, e, o, a, r) {
    const n = e.cartesianToCartographic(t, b),
      s = T.getHeight(n.height, o, a);
    return i.Cartesian3.fromRadians(n.longitude, n.latitude, s, e, r);
  };
  var P = T;
  var z = Object.freeze({ NONE: 0, BITS12: 1 });
  const _ = new i.Cartesian3(),
    E = new i.Cartesian3(),
    H = new i.Cartesian2(),
    w = new i.Matrix4(),
    A = new i.Matrix4(),
    I = Math.pow(2, 12);
  function V(t, e, a, r, n, s, c, d, u, l) {
    let m,
      h,
      f = z.NONE;
    if (o.defined(e) && o.defined(a) && o.defined(r) && o.defined(n)) {
      const t = e.minimum,
        o = e.maximum,
        s = i.Cartesian3.subtract(o, t, E),
        c = r - a;
      (f =
        Math.max(i.Cartesian3.maximumComponent(s), c) < I - 1
          ? z.BITS12
          : z.NONE),
        (m = i.Matrix4.inverseTransformation(n, new i.Matrix4()));
      const d = i.Cartesian3.negate(t, _);
      i.Matrix4.multiply(i.Matrix4.fromTranslation(d, w), m, m);
      const u = _;
      (u.x = 1 / s.x),
        (u.y = 1 / s.y),
        (u.z = 1 / s.z),
        i.Matrix4.multiply(i.Matrix4.fromScale(u, w), m, m),
        (h = i.Matrix4.clone(n)),
        i.Matrix4.setTranslation(h, i.Cartesian3.ZERO, h),
        (n = i.Matrix4.clone(n, new i.Matrix4()));
      const l = i.Matrix4.fromTranslation(t, w),
        p = i.Matrix4.fromScale(s, A),
        x = i.Matrix4.multiply(l, p, w);
      i.Matrix4.multiply(n, x, n), i.Matrix4.multiply(h, x, h);
    }
    (this.quantization = f),
      (this.minimumHeight = a),
      (this.maximumHeight = r),
      (this.center = i.Cartesian3.clone(t)),
      (this.toScaledENU = m),
      (this.fromScaledENU = n),
      (this.matrix = h),
      (this.hasVertexNormals = s),
      (this.hasWebMercatorT = o.defaultValue(c, !1)),
      (this.hasGeodeticSurfaceNormals = o.defaultValue(d, !1)),
      (this.exaggeration = o.defaultValue(u, 1)),
      (this.exaggerationRelativeHeight = o.defaultValue(l, 0)),
      (this.stride = 0),
      (this._offsetGeodeticSurfaceNormal = 0),
      (this._offsetVertexNormal = 0),
      this._calculateStrideAndOffsets();
  }
  V.prototype.encode = function (t, e, o, n, s, c, d, u) {
    const l = n.x,
      m = n.y;
    if (this.quantization === z.BITS12) {
      ((o = i.Matrix4.multiplyByPoint(this.toScaledENU, o, _)).x =
        r.CesiumMath.clamp(o.x, 0, 1)),
        (o.y = r.CesiumMath.clamp(o.y, 0, 1)),
        (o.z = r.CesiumMath.clamp(o.z, 0, 1));
      const n = this.maximumHeight - this.minimumHeight,
        c = r.CesiumMath.clamp((s - this.minimumHeight) / n, 0, 1);
      i.Cartesian2.fromElements(o.x, o.y, H);
      const u = a.AttributeCompression.compressTextureCoordinates(H);
      i.Cartesian2.fromElements(o.z, c, H);
      const h = a.AttributeCompression.compressTextureCoordinates(H);
      i.Cartesian2.fromElements(l, m, H);
      const f = a.AttributeCompression.compressTextureCoordinates(H);
      if (((t[e++] = u), (t[e++] = h), (t[e++] = f), this.hasWebMercatorT)) {
        i.Cartesian2.fromElements(d, 0, H);
        const o = a.AttributeCompression.compressTextureCoordinates(H);
        t[e++] = o;
      }
    } else
      i.Cartesian3.subtract(o, this.center, _),
        (t[e++] = _.x),
        (t[e++] = _.y),
        (t[e++] = _.z),
        (t[e++] = s),
        (t[e++] = l),
        (t[e++] = m),
        this.hasWebMercatorT && (t[e++] = d);
    return (
      this.hasVertexNormals &&
        (t[e++] = a.AttributeCompression.octPackFloat(c)),
      this.hasGeodeticSurfaceNormals &&
        ((t[e++] = u.x), (t[e++] = u.y), (t[e++] = u.z)),
      e
    );
  };
  const q = new i.Cartesian3(),
    G = new i.Cartesian3();
  (V.prototype.addGeodeticSurfaceNormals = function (t, e, i) {
    if (this.hasGeodeticSurfaceNormals) return;
    const o = this.stride,
      a = t.length / o;
    (this.hasGeodeticSurfaceNormals = !0), this._calculateStrideAndOffsets();
    const r = this.stride;
    for (let n = 0; n < a; n++) {
      for (let i = 0; i < o; i++) {
        const a = n * o + i;
        e[n * r + i] = t[a];
      }
      const a = this.decodePosition(e, n, q),
        s = i.geodeticSurfaceNormal(a, G),
        c = n * r + this._offsetGeodeticSurfaceNormal;
      (e[c] = s.x), (e[c + 1] = s.y), (e[c + 2] = s.z);
    }
  }),
    (V.prototype.removeGeodeticSurfaceNormals = function (t, e) {
      if (!this.hasGeodeticSurfaceNormals) return;
      const i = this.stride,
        o = t.length / i;
      (this.hasGeodeticSurfaceNormals = !1), this._calculateStrideAndOffsets();
      const a = this.stride;
      for (let r = 0; r < o; r++)
        for (let o = 0; o < a; o++) {
          const n = r * i + o;
          e[r * a + o] = t[n];
        }
    }),
    (V.prototype.decodePosition = function (t, e, r) {
      if (
        (o.defined(r) || (r = new i.Cartesian3()),
        (e *= this.stride),
        this.quantization === z.BITS12)
      ) {
        const o = a.AttributeCompression.decompressTextureCoordinates(t[e], H);
        (r.x = o.x), (r.y = o.y);
        const n = a.AttributeCompression.decompressTextureCoordinates(
          t[e + 1],
          H
        );
        return (r.z = n.x), i.Matrix4.multiplyByPoint(this.fromScaledENU, r, r);
      }
      return (
        (r.x = t[e]),
        (r.y = t[e + 1]),
        (r.z = t[e + 2]),
        i.Cartesian3.add(r, this.center, r)
      );
    }),
    (V.prototype.getExaggeratedPosition = function (t, e, i) {
      i = this.decodePosition(t, e, i);
      const o = this.exaggeration,
        a = this.exaggerationRelativeHeight;
      if (1 !== o && this.hasGeodeticSurfaceNormals) {
        const r = this.decodeGeodeticSurfaceNormal(t, e, G),
          n = this.decodeHeight(t, e),
          s = P.getHeight(n, o, a) - n;
        (i.x += r.x * s), (i.y += r.y * s), (i.z += r.z * s);
      }
      return i;
    }),
    (V.prototype.decodeTextureCoordinates = function (t, e, r) {
      return (
        o.defined(r) || (r = new i.Cartesian2()),
        (e *= this.stride),
        this.quantization === z.BITS12
          ? a.AttributeCompression.decompressTextureCoordinates(t[e + 2], r)
          : i.Cartesian2.fromElements(t[e + 4], t[e + 5], r)
      );
    }),
    (V.prototype.decodeHeight = function (t, e) {
      if (((e *= this.stride), this.quantization === z.BITS12)) {
        return (
          a.AttributeCompression.decompressTextureCoordinates(t[e + 1], H).y *
            (this.maximumHeight - this.minimumHeight) +
          this.minimumHeight
        );
      }
      return t[e + 3];
    }),
    (V.prototype.decodeWebMercatorT = function (t, e) {
      return (
        (e *= this.stride),
        this.quantization === z.BITS12
          ? a.AttributeCompression.decompressTextureCoordinates(t[e + 3], H).x
          : t[e + 6]
      );
    }),
    (V.prototype.getOctEncodedNormal = function (t, e, o) {
      const a = t[(e = e * this.stride + this._offsetVertexNormal)] / 256,
        r = Math.floor(a),
        n = 256 * (a - r);
      return i.Cartesian2.fromElements(r, n, o);
    }),
    (V.prototype.decodeGeodeticSurfaceNormal = function (t, e, i) {
      return (
        (e = e * this.stride + this._offsetGeodeticSurfaceNormal),
        (i.x = t[e]),
        (i.y = t[e + 1]),
        (i.z = t[e + 2]),
        i
      );
    }),
    (V.prototype._calculateStrideAndOffsets = function () {
      let t = 0;
      if (this.quantization === z.BITS12) t += 3;
      else t += 6;
      this.hasWebMercatorT && (t += 1),
        this.hasVertexNormals && ((this._offsetVertexNormal = t), (t += 1)),
        this.hasGeodeticSurfaceNormals &&
          ((this._offsetGeodeticSurfaceNormal = t), (t += 3)),
        (this.stride = t);
    });
  const O = {
      position3DAndHeight: 0,
      textureCoordAndEncodedNormals: 1,
      geodeticSurfaceNormal: 2,
    },
    B = { compressed0: 0, compressed1: 1, geodeticSurfaceNormal: 2 };
  (V.prototype.getAttributes = function (t) {
    const e = r.ComponentDatatype.FLOAT,
      i = r.ComponentDatatype.getSizeInBytes(e),
      o = this.stride * i;
    let a = 0;
    const n = [];
    function s(r, s) {
      n.push({
        index: r,
        vertexBuffer: t,
        componentDatatype: e,
        componentsPerAttribute: s,
        offsetInBytes: a,
        strideInBytes: o,
      }),
        (a += s * i);
    }
    if (this.quantization === z.NONE) {
      s(O.position3DAndHeight, 4);
      let t = 2;
      (t += this.hasWebMercatorT ? 1 : 0),
        (t += this.hasVertexNormals ? 1 : 0),
        s(O.textureCoordAndEncodedNormals, t),
        this.hasGeodeticSurfaceNormals && s(O.geodeticSurfaceNormal, 3);
    } else {
      const t = this.hasWebMercatorT || this.hasVertexNormals,
        e = this.hasWebMercatorT && this.hasVertexNormals;
      s(B.compressed0, t ? 4 : 3),
        e && s(B.compressed1, 1),
        this.hasGeodeticSurfaceNormals && s(B.geodeticSurfaceNormal, 3);
    }
    return n;
  }),
    (V.prototype.getAttributeLocations = function () {
      return this.quantization === z.NONE ? O : B;
    }),
    (V.clone = function (t, e) {
      if (o.defined(t))
        return (
          o.defined(e) || (e = new V()),
          (e.quantization = t.quantization),
          (e.minimumHeight = t.minimumHeight),
          (e.maximumHeight = t.maximumHeight),
          (e.center = i.Cartesian3.clone(t.center)),
          (e.toScaledENU = i.Matrix4.clone(t.toScaledENU)),
          (e.fromScaledENU = i.Matrix4.clone(t.fromScaledENU)),
          (e.matrix = i.Matrix4.clone(t.matrix)),
          (e.hasVertexNormals = t.hasVertexNormals),
          (e.hasWebMercatorT = t.hasWebMercatorT),
          (e.hasGeodeticSurfaceNormals = t.hasGeodeticSurfaceNormals),
          (e.exaggeration = t.exaggeration),
          (e.exaggerationRelativeHeight = t.exaggerationRelativeHeight),
          e._calculateStrideAndOffsets(),
          e
        );
    }),
    (t.EllipsoidalOccluder = n),
    (t.TerrainEncoding = V);
});
