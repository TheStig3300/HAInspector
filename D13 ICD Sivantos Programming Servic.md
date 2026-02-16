To implement a Web Bluetooth interface for reading EEPROM data from a Sivantos hearing aid, an AI or developer must follow a two-tier protocol: the **Control Channel** (for session management) and the **Data Channel** (for the **PIP - Programming Interface Protocol**).

### 1. GATT Service and Characteristic Definitions

All communications occur over the Sivantos Programming Service:

* 
**Service UUID:** `C8F7A831-21B2-4588-87F8-BD49A13EFF49` 


* 
**Control REQ:** `C8F79C9A-21B2-45B8-87F8-BD49A13EFF49` (Write Without Response) 


* 
**Control RSP:** `C8F73DC3-21B2-45B8-87F8-BD49A13EFF49` (Notify) 


* 
**Data REQ:** `C8F7A8E4-21B2-45B8-87F8-BD49A13EFF49` (Write Without Response) 


* 
**Data RSP:** `C8F7A68A-21B2-45B8-87F8-BD49A13EFF49` (Notify) 



### 2. Session Initialization (Control Channel)

Before sending data, you must activate the "BLE Programming" state to prevent parallel sessions.

1. 
**Subscribe** to notifications on **Control RSP**.


2. 
**Send Start Command**: Write to **Control REQ**.


* 
**Byte 0**: `0x00` (Status/Header) 


* 
**Byte 1**: `0x00` (Command ID: Start Programming Mode) 


* 
**Bytes 2–7**: 6-byte BD_ADDR (or a random 6-byte value for Web Bluetooth) 




3. 
**Wait for Response**: The HA will notify **Control RSP** with status `0` (Success).



### 3. Transport Configuration

For efficient EEPROM reading, increase throughput and determine fragmentation limits.

* 
**Set Priority**: Write to **Control REQ** with Command ID `5` and Payload `0` (High Priority).


* 
**Get MTU**: The HA response to priority/parameter updates includes the negotiated **ATT MTU size**.


* 
**Fragmentation**: If MTU < 158 bytes, the maximum PIP fragment is **MTU - 3**.



### 4. PIP Data Frame Structure (Data Channel)

The Data Channel transparently carries PIP messages. Every PIP packet uses **Little Endian 32-bit (4-byte) word alignment**.

Request Header (4-byte Control Word):

* 
**Bits [0:7]**: Magic number (`0x71`) 


* 
**Bits**: Access Mode (`0x0` for Multi-Address Read, `0x2` for Burst Read) 


* 
**Bits**: Byte Length (Total length including Control word, excluding CRC) 


* 
**Bit [28]**: Access Type (`0x0` for Request) 



Full Request Packet (Host to HI):

1. **Control Word** (4 bytes)
2. 
**ComID** (4 bytes): Must use the ID obtained via the `Get ComID` command.


3. 
**Address(es)** (4 bytes each): The memory address of the EEPROM data.


4. 
**CRC32** (4 bytes): Calculated using polynomial `0x04C11DB7`, init value `0xC704DD7B`.



### 5. Implementation Steps for AI

| Step | Action | Logic |
| --- | --- | --- |
| **1** | **Scan & Connect** | Filter for Service UUID `C8F7A831...`.

 |
| **2** | **Lock Session** | Write `[0x00, 0x00, ...random 6 bytes]` to Control REQ.

 |
| **3** | **Read Parameters** | Construct PIP Read Request (Control + ComID + Addr + CRC32).

 |
| **4** | **Fragment** | Split PIP packet into chunks of `MTU - 3` bytes for Data REQ.

 |
| **5** | **Reassemble** | Collect notifications from Data RSP and verify the CRC32.

 |
| **6** | **Release** | Write `[0x00, 0x01]` (Stop Programming Mode) to Control REQ.

 |

**Warning:** Access must be 4-byte aligned. Unaligned access will cause the firmware to abort the request with error `0xFFFFFFF1`.