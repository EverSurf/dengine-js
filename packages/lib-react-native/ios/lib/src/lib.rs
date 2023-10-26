/*
* Copyright 2018-2020 TON Labs LTD.
*
* Licensed under the SOFTWARE EVALUATION License (the "License"); you may not use
* this file except in compliance with the License.
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific TON DEV software governing permissions and
* limitations under the License.
*/

extern crate dengine;
extern crate libc;

pub use dengine::{
    tc_create_dengine_context, tc_dengine_destroy_string, tc_dengine_read_string,
    tc_dengine_request, tc_dengine_request_sync, tc_destroy_dengine_context, CResponseHandler,
    ContextHandle, ResponseType, StringData,
};
