//
// Autogenerated by Thrift Compiler (0.9.2)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;


var ttypes = require('./remoteinvoke_types');
//HELPER FUNCTIONS AND STRUCTURES

RemoteInvoke_invoke_args = function(args) {
  this.request = null;
  if (args) {
    if (args.request !== undefined) {
      this.request = args.request;
    }
  }
};
RemoteInvoke_invoke_args.prototype = {};
RemoteInvoke_invoke_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.request = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

RemoteInvoke_invoke_args.prototype.write = function(output) {
  output.writeStructBegin('RemoteInvoke_invoke_args');
  if (this.request !== null && this.request !== undefined) {
    output.writeFieldBegin('request', Thrift.Type.STRING, 1);
    output.writeString(this.request);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

RemoteInvoke_invoke_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
RemoteInvoke_invoke_result.prototype = {};
RemoteInvoke_invoke_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 0:
      if (ftype == Thrift.Type.STRING) {
        this.success = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

RemoteInvoke_invoke_result.prototype.write = function(output) {
  output.writeStructBegin('RemoteInvoke_invoke_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRING, 0);
    output.writeString(this.success);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

RemoteInvokeClient = exports.Client = function(output, pClass) {
    this.output = output;
    this.pClass = pClass;
    this._seqid = 0;
    this._reqs = {};
};
RemoteInvokeClient.prototype = {};
RemoteInvokeClient.prototype.seqid = function() { return this._seqid; }
RemoteInvokeClient.prototype.new_seqid = function() { return this._seqid += 1; }
RemoteInvokeClient.prototype.invoke = function(request, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_invoke(request);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_invoke(request);
  }
};

RemoteInvokeClient.prototype.send_invoke = function(request) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('invoke', Thrift.MessageType.CALL, this.seqid());
  var args = new RemoteInvoke_invoke_args();
  args.request = request;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

RemoteInvokeClient.prototype.recv_invoke = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new RemoteInvoke_invoke_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('invoke failed: unknown result');
};
RemoteInvokeProcessor = exports.Processor = function(handler) {
  this._handler = handler
}
RemoteInvokeProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.EXCEPTION, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
}

RemoteInvokeProcessor.prototype.process_invoke = function(seqid, input, output) {
  var args = new RemoteInvoke_invoke_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.invoke.length === 1) {
    Q.fcall(this._handler.invoke, args.request)
      .then(function(result) {
        var result = new RemoteInvoke_invoke_result({success: result});
        output.writeMessageBegin("invoke", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      }, function (err) {
        var result = new RemoteInvoke_invoke_result(err);
        output.writeMessageBegin("invoke", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.invoke(args.request,  function (err, result) {
      var result = new RemoteInvoke_invoke_result((err != null ? err : {success: result}));
      output.writeMessageBegin("invoke", Thrift.MessageType.REPLY, seqid);
      result.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
}

