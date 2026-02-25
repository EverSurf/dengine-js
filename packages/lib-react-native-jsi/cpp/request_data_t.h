#pragma once

#include <string>
#include <vector>
#include <utility>

#include <folly/dynamic.h>

#include "DebotClientJsiModule.h"

using namespace facebook;

namespace eversurf
{
  typedef struct request_data_t
  {
    DebotClientJsiModule *jsiModule; // to access runtime, jsCallInvoker and blobManager
    uint32_t requestId;
    bool returnBlob = false; // whether to replace strings with blobs in the request params or not
  } request_data_t;

} // namespace
