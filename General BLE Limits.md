
## General BLE Limits

- BLE is not designed for high throughput. Typical user space rates are in the low tens of KB per second, at best.
- Most browser implementations limit the number of concurrent operations (typically 1-2 outstanding read/write requests per characteristic).
- Peripheral and browser constraints (e.g., allowed MTU, connection interval) strongly influence performance.

---

## Parameters Affecting Maximum Read Speed

1. **Larger MTU (Maximum Transmission Unit) size**
   - Higher MTU allows more data in a single GATT operation. Goal: Use the largest possible MTU.
   - **Limitation:** The browser does not currently offer a way to request a larger MTU directly. Chrome/Web Bluetooth negotiates the highest MTU possible during connection establishment.
   - **Peripheral-side:** If you control firmware, allow the largest supported MTU (often 247 or 512 bytes).

2. **Use notifications/indications for data streaming**
   - Subscribing to notifications (`notify: true`) is often faster than repeated explicit reads—notifications can be pushed immediately as packets become available.
   - For maximum speed, listen to notifications on a characteristic, and push data from the peripheral.

3. **Minimize application logic and parsing**
   - Minimize operations in your JavaScript between reads (or notification handling) to avoid blocking the event loop.

4. **Connection interval (peripheral-initiated)**
   - Lower intervals mean faster packet exchanges, but only the peripheral can propose this—no browser control.

---

## Parameters Affecting Maximum Write Speed

1. **Use `writeWithoutResponse` if supported**
   - Characteristics supporting `writeWithoutResponse` allow queuing multiple writes without waiting for ACKs, leading to much higher throughput:
     ```js
     characteristic.writeValueWithoutResponse(data);
     ```
   - With `write` (with response), you must await each promise, which limits speed:
     ```js
     await characteristic.writeValue(data);
     ```
   - Check via `characteristic.properties.writeWithoutResponse`.

2. **Chunk size**
   - Send data in chunks close to the negotiated MTU minus protocol overhead. Don't exceed the limit (usually 20, 23, 244, or up to 512 bytes, but confirm for your device).

3. **Pipelined/asynchronous writes**
   - If `writeWithoutResponse` is available, you may queue several writes quickly in succession.
   - Avoid awaiting each write promise; just fire off as many as the device reliably supports.

---

## Web Bluetooth Constraints

- **No manual MTU adjustment**—MTU is negotiated on connect, limited by browser and device.
- **No explicit control over connection interval/security parameters**—device/OS determines these.

---

## Max Speed Summary Table

| Parameter                | Read (Max)                 | Write (Max)                      | How to Use                        |
|--------------------------|----------------------------|-----------------------------------|------------------------------------|
| Use notifications        | Yes (*subscribe*)          | –                                 | `characteristic.startNotifications()` |
| Use `writeWithoutResponse` | –                          | Yes                              | `characteristic.writeValueWithoutResponse()` |
| Chunk size               | ≤ negotiated MTU           | ≤ negotiated MTU                  | `value.buffer.byteLength <= MTU`   |
| Concurrency              | –                          | Yes (`writeWithoutResponse`)      | Queue writes, don’t await each     |
| Lower connection interval| If supported by device     | If supported by device            | Peripheral config/firmware         |
| Minimize logic           | Yes                        | Yes                               | JS code efficiency                 |

---

## Example: Fastest Writes

```js
if (characteristic.properties.writeWithoutResponse) {
  // Send multiple chunks in quick succession
  for (const chunk of myChunks) {
    characteristic.writeValueWithoutResponse(chunk);
  }
} else {
  // Fallback: must await each write
  for (const chunk of myChunks) {
    await characteristic.writeValue(chunk);
  }
}
```

## Example: Highest Read Speed via Notifications

```js
await characteristic.startNotifications();
characteristic.addEventListener('characteristicvaluechanged', event => {
  const value = event.target.value;
  // Process value immediately
});
```

---

### References
- [Web Bluetooth: Maximizing data throughput (Google sample)](https://googlechrome.github.io/samples/web-bluetooth/notifications.html)
- [BLE throughput and performance (Nordic)](https://devzone.nordicsemi.com/nordic/nordic-blog/b/blog/posts/maximizing-ble-throughput)
- [Web Bluetooth API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)

---

**Summary:**  
- **For reads:** Use notifications for streaming; browser will pull at max allowed by BLE stack/device.
- **For writes:** Use `writeWithoutResponse` and full-MTU chunks, pipelined if possible.
- **MTU/Connection interval:** Not controllable from JavaScript—set in firmware, auto-negotiated with browser.
- **Speed is bounded by device, browser, BLE stack, and radio conditions.**

Let me know if you need code samples for chunking, or have control over the device firmware for more aggressive optimizations!