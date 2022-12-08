# NCUcourt_backend
- 命名規則：Lower Camel Case
- 一些資料庫的補充資訊：
   - court collection 的 status：true -> 尚有可預約時段 / false -> 不開放或無可預約之時段
   - admin 是校隊隊長
   - superadmin 可以新增、刪除、修改、查詢所有 admin
   - admin collection 的 status：true -> 是一般校隊隊長 / false -> 是 superAdmin
   - user collection 的 status：true -> 可預約場地 / false -> 不可預約場地（被停權）
   
