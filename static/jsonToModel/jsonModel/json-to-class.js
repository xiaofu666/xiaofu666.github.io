

const SFValueType = {
    _Int        : 0,
    _Float      : 1,
    _Boolean    : 2,
    _String     : 3,
    _Array      : 4,
    _Dictionary : 5,
    _Null       : 6
};

function SFValue(value) {
    this.type = SFValueType._Null;
    if (this.isString(value)){
        this.type = SFValueType._String;
    }else if (this.isInt(value)) {
        this.type = SFValueType._Int;
    }else if (this.isFloat(value)) {
        this.type = SFValueType._Float;
    }else if (this.isBoolean(value)) {
        this.type = SFValueType._Boolean;
    }else if (this.isArray(value)) {
        this.type = SFValueType._Array;
    }else if (value !== null) {
        this.type = SFValueType._Dictionary;
    }
}

SFValue.prototype.isArray = function(value) {
    return value !== null &&
    typeof value === 'object' &&
    value.hasOwnProperty('length') &&
    typeof value.length === 'number' &&
    typeof value.splice === 'function' &&
    !(value.propertyIsEnumerable('length'));
};

SFValue.prototype.isString = function(value) {
    return value !== null &&
    typeof value === 'string';
};

SFValue.prototype.isBoolean = function(value) {
    return value !== null &&
    typeof value === 'boolean';
};

SFValue.prototype.isInt = function(value) {
    return value !== null &&
    typeof value === 'number' &&
    value === parseInt(value);
};

SFValue.prototype.isFloat = function(value) {
    return value !== null &&
    typeof value === 'number' &&
    value === parseFloat(value);
};

SFValue.prototype.isObject = function(value) {
    return value !== null &&
    value instanceof Object;
};

const SFParserLanguage = {
    Swift              : 0,
    SwiftClass         : 6,
    SwiftSexyJson      : 7,
    SwiftSexyJsonClass : 8,
    OC                 : 1,
    Java               : 2,
    Python             : 3,
    Kotlin             : 4,
    CNet               : 5,
    Unknown            : 9,
    Dart               : 10,

    /**
     * 返回语言描述
     */
    desc : function (type) {
        switch (type) {
            case this.Python:
                return 'Python';
            case this.Kotlin:
                return 'Kotlin';
            case this.Swift:
                return 'Swift';
            case this.CNet:
                return 'C#';
            case this.Java:
                return 'Java';
            case this.SwiftClass:
                return 'SwiftClass';
            case this.SwiftSexyJson:
                return 'SwiftSexyJson';
            case this.SwiftSexyJsonClass:
                return 'SwiftSexyJsonClass';
            case this.OC:
                return 'Objective-c';
            case this.Dart:
                return 'Dart';
            default:
                return 'unkown';
        }
    }
};

function SFJsonParser(type) {
    this.type = type;
    this.classImplementation = '';
    this.classHeader = '';
    this.rootClassName = 'SF';
    this.isExistArray = false;
    this.kJavaSetGetString = '    public void setSFPROPERTY(SFTYPE SFProperty){\n\
        this.SFProperty = SFProperty;\n\
    }\n\
    public SFTYPE getSFPROPERTY(){\n\
        return this.SFProperty;\n\
    }\n';
}

SFJsonParser.prototype.keyCount = function(value) {
    let valueInfo = new SFValue(value);
    switch (valueInfo.type) {
        case SFValueType._Array: {
            return value.length;
        }
        case SFValueType._Dictionary: {
            let count = 0;
            for (let k in value) {
                count += 1;
            }
            return count;
        }
        default:
            return 0;
    }
};

SFJsonParser.prototype.makeClassName = function(key) {
    let key_len = key.length;
    if (key_len > 0) {
        return key.charAt(0).toLocaleUpperCase() + (key_len > 1 ? key.substr(1, key.length - 1) : '');
    }
};

SFJsonParser.prototype.makeLowerName = function(key) {
    let key_len = key.length;
    if (key_len > 0) {
        return key.charAt(0).toLocaleLowerCase() + (key_len > 1 ? key.substr(1, key.length - 1) : '');
    }
};

SFJsonParser.prototype.arrayElementType = function(key, element) {
    let elementInfo = new SFValue(element);
    switch (this.type) {
        case SFParserLanguage.Swift:
        case SFParserLanguage.SwiftClass:
        case SFParserLanguage.SwiftSexyJson:
        case SFParserLanguage.SwiftSexyJsonClass:
            switch (elementInfo.type) {
                case SFValueType._String: {
                    return 'String';
                }
                case SFValueType._Int: {
                    return 'Int';
                }
                case SFValueType._Float: {
                    return 'CGFloat';
                }
                case SFValueType._Boolean: {
                    return 'Bool';
                }
                case SFValueType._Dictionary: {
                    return this.makeClassName(key);
                }
                case SFValueType._Array: {
                    if (element.length > 0) {
                        return '[' + this.arrayElementType(key, element[0]) + ']'
                    }
                    return 'Any'
                }
            }
            break;
        case SFParserLanguage.OC:
            switch (elementInfo.type) {
                case SFValueType._String: {
                    return 'NSString *';
                }
                case SFValueType._Int:
                case SFValueType._Float:
                case SFValueType._Boolean: {
                    return 'NSNumber *';
                }
                case SFValueType._Dictionary: {
                    return this.makeClassName(key) + ' *';
                }
                case SFValueType._Array: {
                    if (element.length > 0) {
                        return 'NSArray<' + this.arrayElementType(key, element[0]) + ' *> *';
                    }
                    return 'NSObject *'
                }
            }
            break;
        case SFParserLanguage.Java:
            switch (elementInfo.type) {
                case SFValueType._Null:
                case SFValueType._String: {
                    return 'String';
                }
                case SFValueType._Int: {
                    return 'Integer';
                }
                case SFValueType._Float: {
                    return 'Float';
                }
                case SFValueType._Boolean: {
                    return 'Boolean';
                }
                case SFValueType._Dictionary: {
                    return this.makeClassName(key);
                }
                case SFValueType._Array: {
                    if (element.length > 0) {
                        return 'List<' + this.arrayElementType(key, element[0]) + '>'
                    }
                    return 'Object'
                }
            }
            break;
        case SFParserLanguage.CNet:
            switch (elementInfo.type) {
                case SFValueType._Null:
                case SFValueType._String: {
                    return 'string';
                }
                case SFValueType._Int: {
                    return 'int';
                }
                case SFValueType._Float: {
                    return 'float';
                }
                case SFValueType._Boolean: {
                    return 'bool';
                }
                case SFValueType._Dictionary: {
                    return this.makeClassName(key);
                }
                case SFValueType._Array: {
                    if (element.length > 0) {
                        return 'List<' + this.arrayElementType(key, element[0]) + '>'
                    }
                    return 'Object'
                }
            }
            break;
        case SFParserLanguage.Dart:
                switch (elementInfo.type) {
                    case SFValueType._Null:
                    case SFValueType._String: {
                        return 'String';
                    }
                    case SFValueType._Int: {
                        return 'int';
                    }
                    case SFValueType._Float: {
                        return 'float';
                    }
                    case SFValueType._Boolean: {
                        return 'bool';
                    }
                    case SFValueType._Dictionary: {
                        return this.makeClassName(key);
                    }
                    case SFValueType._Array: {
                        if (element.length > 0) {
                            return 'List<' + this.arrayElementType(key, element[0]) + '>';
                        }
                        return 'Object';
                    }
                }
                break;
        default:
            break;
    }
};

SFJsonParser.prototype.makeSetGetMothod = function(proType, key, keytype) {
    let setget = '';
    switch (this.type) {
        case SFParserLanguage.SwiftSexyJson:
        case SFParserLanguage.SwiftSexyJsonClass:
            setget = '      ' + this.makeLowerName(key) + '    <<<    ' + 'map["' + key + '"]\n';
            break;
        case SFParserLanguage.Java: {
            setget = this.kJavaSetGetString.replace(/SFTYPE/g,keytype);
            setget = setget.replace(/SFPROPERTY/g,this.makeClassName(key));
            setget = setget.replace(/SFProperty/g,this.makeLowerName(key));
        }
            break;
        default:
            break;
    }
    return setget;
};

SFJsonParser.prototype.firstLower = function(key) {
    if (key !== void 0 && key.length > 0) {
        let first = key.charAt(0);
        return key.charAt(0).toLowerCase() + key.substr(1, key.length - 1)
    }
    return '';
};

SFJsonParser.prototype.makeProperty = function(proType, key, value) {
    let property_str = '';
    let setget_str = '';
    switch (this.type) {
        case SFParserLanguage.Swift:
        case SFParserLanguage.SwiftClass:
        case SFParserLanguage.SwiftSexyJson:
        case SFParserLanguage.SwiftSexyJsonClass:
            switch (proType) {
                case SFValueType._Null:
                case SFValueType._String: {
                    setget_str = this.makeSetGetMothod(proType,key,'String');
                    property_str = '    var ' + this.makeLowerName(key) + ': String?\n';
                    break;
                }
                case SFValueType._Int: {
                    setget_str = this.makeSetGetMothod(proType,key,'Int');
                    property_str = '    var ' + this.makeLowerName(key) + ': Int = 0\n';
                    break;
                }
                case SFValueType._Float: {
                    setget_str = this.makeSetGetMothod(proType,key,'CGFloat');
                    property_str = '    var ' + this.makeLowerName(key) + ': CGFloat = 0\n';
                    break;
                }
                case SFValueType._Boolean: {
                    setget_str = this.makeSetGetMothod(proType,key,'Bool');
                    property_str = '    var ' + this.makeLowerName(key) + ': Bool = false\n';
                    break;
                }
                case SFValueType._Dictionary: {
                    setget_str = this.makeSetGetMothod(proType,key,this.makeClassName(key));
                    property_str = '    var ' + this.makeLowerName(key) + ': ' + this.makeClassName(key) + "?\n";
                    break;
                }
                case SFValueType._Array: {
                    let valueInfo = new SFValue(value);
                    switch (valueInfo.type) {
                        case SFValueType._String:
                            setget_str = this.makeSetGetMothod(proType,key,'[String]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [String]?\n';
                            break;
                        case SFValueType._Int:
                            setget_str = this.makeSetGetMothod(proType,key,'[Int]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [Int]?\n';
                            break;
                        case SFValueType._Float:
                            setget_str = this.makeSetGetMothod(proType,key,'[CGFloat]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [CGFloat]?\n';
                            break;
                        case SFValueType._Boolean:
                            setget_str = this.makeSetGetMothod(proType,key,'[Bool]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [Bool]?\n';
                            break;
                        case SFValueType._Dictionary:
                            setget_str = this.makeSetGetMothod(proType,key,'[' + this.makeClassName(key) + ']');
                            property_str = '    var ' + this.makeLowerName(key) + ': [' + this.makeClassName(key) + ']?\n';
                            break;
                        case SFValueType._Array:
                            if (value.length > 0) {
                                setget_str = this.makeSetGetMothod(proType,key,'[' + this.arrayElementType(key, value[0]) + ']');
                                property_str = '    var ' + this.makeLowerName(key) + ': [' + this.arrayElementType(key, value[0]) + ']?\n';
                                break;
                            }
                            setget_str = this.makeSetGetMothod(proType,key,'[Any]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [Any]?\n';
                            break;
                    }
                }
                    break;
                default:
                    break;
            }
            break;
        case SFParserLanguage.OC:
            switch (proType) {
                case SFValueType._Null:
                case SFValueType._String: {
                    property_str = '@property (nonatomic ,copy) NSString * ' + key + ';\n';
                    break;
                }
                case SFValueType._Int: {
                    property_str = '@property (nonatomic ,assign) NSInteger  ' + key + ';\n';
                    break;
                }
                case SFValueType._Float: {
                    property_str = '@property (nonatomic ,assign) CGFloat  ' + key + ';\n';
                    break;
                }
                case SFValueType._Boolean: {
                    property_str = '@property (nonatomic ,assign) BOOL ' + key + ';\n';
                    break;
                }
                case SFValueType._Dictionary: {
                    property_str = '@property (nonatomic ,strong) ' + this.makeClassName(key) + ' * ' + key + ';\n';
                    break;
                }
                case SFValueType._Array: {
                    let valueInfo = new SFValue(value);
                    switch (valueInfo.type) {
                        case SFValueType._String:
                            property_str = '@property (nonatomic ,copy) NSArray<NSString *> * ' + key + ';\n';
                            break;
                        case SFValueType._Int:
                        case SFValueType._Float:
                        case SFValueType._Boolean:
                            property_str = '@property (nonatomic ,copy) NSArray<NSNumber *> * ' + key + ';\n';
                            break;
                        case SFValueType._Dictionary:
                            property_str = '@property (nonatomic ,copy) NSArray<' + this.makeClassName(key) + ' *> * ' + key + ';\n';
                            break;
                        case SFValueType._Array:
                            if (value.length > 0) {
                                property_str = '@property (nonatomic ,copy) NSArray<' + this.arrayElementType(key, value[0]) + '> * ' + key + ';\n';
                                break;
                            }
                            property_str = '@property (nonatomic ,copy) NSArray<NSObject *> * ' + key + ';\n';
                            break;
                    }
                }
                    break;
                default:
                    break;
            }
            break;
        case SFParserLanguage.Java:
            switch (proType) {
                case SFValueType._Null:
                case SFValueType._String: {
                    setget_str = this.makeSetGetMothod(proType,key,'String');
                    property_str = '    private    String    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case SFValueType._Int: {
                    setget_str = this.makeSetGetMothod(proType,key,'int');
                    property_str = '    private    int    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case SFValueType._Float: {
                    setget_str = this.makeSetGetMothod(proType,key,'float');
                    property_str = '    private    float    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case SFValueType._Boolean: {
                    setget_str = this.makeSetGetMothod(proType,key,'boolean');
                    property_str = '    private    boolean    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case SFValueType._Dictionary: {
                    setget_str = this.makeSetGetMothod(proType,key,this.makeClassName(key));
                    property_str = '    private    ' + this.makeClassName(key) + '    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case SFValueType._Array: {
                    let valueInfo = new SFValue(value);
                    switch (valueInfo.type) {
                        case SFValueType._String:
                            setget_str = this.makeSetGetMothod(proType,key,'List<String>');
                            property_str = '    private    List<String>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case SFValueType._Int:
                            setget_str = this.makeSetGetMothod(proType,key,'List<Integer>');
                            property_str = '    private    List<Integer>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case SFValueType._Float:
                            setget_str = this.makeSetGetMothod(proType,key,'List<Float>');
                            property_str = '    private    List<Float>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case SFValueType._Boolean:
                            setget_str = this.makeSetGetMothod(proType,key,'List<Boolean>');
                            property_str = '    private    List<Boolean>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case SFValueType._Dictionary:
                            setget_str = this.makeSetGetMothod(proType,key,'List<' + this.makeClassName(key) + '>');
                            property_str = '    private    List<' + this.makeClassName(key) + '>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case SFValueType._Array:
                            if (value.length > 0) {
                                setget_str = this.makeSetGetMothod(proType,key,'List<' + this.arrayElementType(key, value[0]) + '>');
                                property_str = '    private    List<' + this.arrayElementType(key, value[0]) + '>    ' + this.makeLowerName(key) + ';\n';
                                break;
                            }
                            setget_str = this.makeSetGetMothod(proType,key,'List<Object>');
                            property_str = '    private    List<Object>    ' + this.makeLowerName(key) + ';\n';
                            break;
                    }
                }
                    break;
                default:
                    break;
            }
            break;
            case SFParserLanguage.Dart:
                switch (proType) {
                    case SFValueType._Null:
                    case SFValueType._String: {
                        setget_str = this.makeSetGetMothod(proType,key,'String');
                        property_str = '    String    ' + this.makeLowerName(key) + ';\n';
                        break;
                    }
                    case SFValueType._Int: {
                        setget_str = this.makeSetGetMothod(proType,key,'int');
                        property_str = '    int    ' + this.makeLowerName(key) + ';\n';
                        break;
                    }
                    case SFValueType._Float: {
                        setget_str = this.makeSetGetMothod(proType,key,'float');
                        property_str = '    float    ' + this.makeLowerName(key) + ';\n';
                        break;
                    }
                    case SFValueType._Boolean: {
                        setget_str = this.makeSetGetMothod(proType,key,'bool');
                        property_str = '    bool    ' + this.makeLowerName(key) + ';\n';
                        break;
                    }
                    case SFValueType._Dictionary: {
                        setget_str = this.makeSetGetMothod(proType,key,this.makeClassName(key));
                        property_str = '    ' + this.makeClassName(key) + '    ' + this.makeLowerName(key) + ';\n';
                        break;
                    }
                    case SFValueType._Array: {
                        let valueInfo = new SFValue(value);
                        switch (valueInfo.type) {
                            case SFValueType._String:
                                setget_str = this.makeSetGetMothod(proType,key,'List<String>');
                                property_str = '    List<String>    ' + this.makeLowerName(key) + ';\n';
                                break;
                            case SFValueType._Int:
                                setget_str = this.makeSetGetMothod(proType,key,'List<int>');
                                property_str = '    List<int>    ' + this.makeLowerName(key) + ';\n';
                                break;
                            case SFValueType._Float:
                                setget_str = this.makeSetGetMothod(proType,key,'List<float>');
                                property_str = '    List<float>    ' + this.makeLowerName(key) + ';\n';
                                break;
                            case SFValueType._Boolean:
                                setget_str = this.makeSetGetMothod(proType,key,'List<bool>');
                                property_str = '    List<bool>    ' + this.makeLowerName(key) + ';\n';
                                break;
                            case SFValueType._Dictionary:
                                setget_str = this.makeSetGetMothod(proType,key,'List<' + this.makeClassName(key) + '>');
                                property_str = '    List<' + this.makeClassName(key) + '>    ' + this.makeLowerName(key) + ';\n';
                                break;
                            case SFValueType._Array:
                                if (value.length > 0) {
                                    setget_str = this.makeSetGetMothod(proType,key,'List<' + this.arrayElementType(key, value[0]) + '>');
                                    property_str = '    List<' + this.arrayElementType(key, value[0]) + '>    ' + this.makeLowerName(key) + ';\n';
                                    break;
                                }
                                setget_str = this.makeSetGetMothod(proType,key,'List<Object>');
                                property_str = '    List<Object>    ' + this.makeLowerName(key) + ';\n';
                                break;
                        }
                    }
                        break;
                    default:
                        break;
                }
            break;
        case SFParserLanguage.CNet:
            switch (proType) {
                case SFValueType._Null:
                case SFValueType._String: {
                    property_str = '    public    string    ' + key + '{set; get;}\n';
                    break;
                }
                case SFValueType._Int: {
                    property_str = '    public    int    ' + key + '{set; get;}\n';
                    break;
                }
                case SFValueType._Float: {
                    property_str = '    public    float    ' + key + '{set; get;}\n';
                    break;
                }
                case SFValueType._Boolean: {
                    property_str = '    public    bool    ' + key + '{set; get;}\n';
                    break;
                }
                case SFValueType._Dictionary: {
                    property_str = '    public    ' + this.makeClassName(key) + '    ' + key + '{set; get;}\n';
                    break;
                }
                case SFValueType._Array: {
                    let valueInfo = new SFValue(value);
                    switch (valueInfo.type) {
                        case SFValueType._String:
                            property_str = '    public    List<string>    ' + key + '{set; get;}\n';
                            break;
                        case SFValueType._Int:
                            property_str = '    public    List<int>    ' + key + '{set; get;}\n';
                            break;
                        case SFValueType._Float:
                            property_str = '    public    List<float>    ' + key + '{set; get;}\n';
                            break;
                        case SFValueType._Boolean:
                            property_str = '    public    List<bool>    ' + key + '{set; get;}\n';
                            break;
                        case SFValueType._Dictionary:
                            property_str = '    public    List<' + this.makeClassName(key) + '>    ' + key + '{set; get;}\n';
                            break;
                        case SFValueType._Array:
                            if (value.length > 0) {
                                property_str = '    public    List<' + this.arrayElementType(key, value[0]) + '>    ' + key + '{set; get;}\n';
                                break;
                            }
                            property_str = '    private    List<Object>    ' + key + '{set; get;}\n';
                            break;
                    }
                }
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return [property_str, setget_str];
};

SFJsonParser.prototype.makeClassBeginTxt = function(key) {
    let begin_txt = '';
    switch (this.type) {
        case SFParserLanguage.Dart:
            begin_txt = '//MARK: - ' + key + ' -\n\n';
            begin_txt += 'class ' + this.makeClassName(key) + ' {\n';
            break;
        case SFParserLanguage.Swift:
             begin_txt = '//MARK: - ' + key + ' -\n\n';
             begin_txt += 'struct ' + this.makeClassName(key) + ' {\n';
             break;
        case SFParserLanguage.SwiftClass:
             begin_txt = '//MARK: - ' + key + ' -\n\n';
             begin_txt += 'class ' + this.makeClassName(key) + ' {\n';
             break;
        case SFParserLanguage.SwiftSexyJson:
             begin_txt = '//MARK: - ' + key + ' -\n\n';
             begin_txt += 'struct ' + this.makeClassName(key) + ':SexyJson {\n';
             break;
        case SFParserLanguage.SwiftSexyJsonClass:
             begin_txt = '//MARK: - ' + key + ' -\n\n';
             begin_txt += 'class ' + this.makeClassName(key) + ':SexyJson {\n';
             break;
        case SFParserLanguage.OC:
             this.classImplementation += '#pragma mark - ' + key + ' -\n\n';
             this.classImplementation += '@implementation ' + this.makeClassName(key) + '\n\n@end\n\n';
             begin_txt = '#pragma mark - ' + key + ' -\n\n';
             begin_txt += '@interface ' + this.makeClassName(key) + ': NSObject\n';
             break;
        case SFParserLanguage.Java:
        case SFParserLanguage.CNet:
             begin_txt = '/*===========' + key +'===========*/\n\n';
             begin_txt += 'public class ' + this.makeClassName(key) + ' {\n';
             break;
        default:
             return '';
    }
    return begin_txt;
};

SFJsonParser.prototype.addDidParsedContent = function(content) {
    switch (this.type) {
        case SFParserLanguage.OC:
            this.classHeader += content;
            break;
        default:
            this.classImplementation += content;
            break;
    }
};

SFJsonParser.prototype.makeClassEndTxt = function() {
    switch (this.type) {
        case SFParserLanguage.Swift:
        case SFParserLanguage.SwiftClass:
        case SFParserLanguage.SwiftSexyJson:
        case SFParserLanguage.SwiftSexyJsonClass:
        case SFParserLanguage.Java:
        case SFParserLanguage.CNet:
        case SFParserLanguage.Dart:
             return '}\n\n';
        case SFParserLanguage.OC:
             return '@end\n\n';
        default:
             return '';
     }
};

SFJsonParser.prototype.executeParseEngine = function(object, class_name) {
    let result = '';
    let setget = '\n';
    for (let key in object) {
        let value = object[key];
        let valueInfo = new SFValue(value);
        switch (valueInfo.type) {
            case SFValueType._Array: {
                this.isExistArray = true;
                let property_info = this.makeProperty(valueInfo.type, key, value);
                result += property_info[0];
                setget += property_info[1];

                let content = '';
                if (value.length > 0) {
                    let max_element = null;
                    for (let i in value) {
                        let element = value[i];
                        if (max_element === null) {
                            max_element = element;
                        }else if (this.keyCount(max_element) < this.keyCount(element)) {
                            max_element = element;
                        }
                    }
                    if (max_element) {
                        let max_element_info = new SFValue(max_element);
                        switch (max_element_info.type) {
                            case SFValueType._Array:
                            case SFValueType._Dictionary:
                                content += this.makeClassBeginTxt(key);
                                content += this.executeParseEngine(max_element, key);
                                if (this.type == SFParserLanguage.Dart) {
                                    content += this.makeDartCreateFunc(max_element, key);
                                }
                                content += this.makeClassEndTxt();
                                this.addDidParsedContent(content);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
                break;
            case SFValueType._Dictionary: {
                let property_info = this.makeProperty(valueInfo.type, key, value);
                result += property_info[0];
                setget += property_info[1];
                let content = this.makeClassBeginTxt(key);
                if (content.length > 0) {
                    content += this.executeParseEngine(value, key);
                    if (this.type == SFParserLanguage.Dart) {
                        content += this.makeDartCreateFunc(value, key);
                    }
                }
                content += this.makeClassEndTxt();
                this.addDidParsedContent(content);
            }
                break;
            case SFValueType._String:
            case SFValueType._Null:
            case SFValueType._Int:
            case SFValueType._Float:
            case SFValueType._Boolean: {
                let property_info = this.makeProperty(valueInfo.type, key, value);
                result += property_info[0];
                setget += property_info[1];
            }
                break;
            default:
                break;
        }
    }
    if (setget && setget !== '\n') {
        switch (this.type) {
            case SFParserLanguage.SwiftSexyJson: {
                let sexy_map = '\n    public mutating func sexyMap(_ map: [String : Any]) {\n';
                sexy_map += this.autoSexyJsonMapAlign(setget);
                sexy_map += '\n   }\n';
                result += sexy_map;
                break;
            }
            case SFParserLanguage.SwiftSexyJsonClass: {
                let sexy_map = '\n    public func sexyMap(_ map: [String : Any]) {\n';
                sexy_map += this.autoSexyJsonMapAlign(setget);
                sexy_map += '\n   }\n';
                result += sexy_map;
                break;
            }
            default:
                result += setget;
                break;
        }
    }
    return result;
};

SFJsonParser.prototype.makeDartCreateFunc = function(json_object, className = this.rootClassName) {
    className = this.makeClassName(className);
    if (json_object != void 0) {
        let result = '\n    ' + className + '({';
        for (const key in json_object) {
            if (json_object.hasOwnProperty(key)) {
                result += 'this.' + key + ', ';
            }
        }
        result += '});\n';
        result += '\n    ' + className + '.fromJson(Map<String, dynamic> json) {\n';
        for (const key in json_object) {
            if (json_object.hasOwnProperty(key)) {
                const value = json_object[key];
                const valueInfo = new SFValue(value);
                switch (valueInfo.type) {
                    case SFValueType._Dictionary: {
                        const subClassName = this.makeClassName(key);
                        result += '      ' + key + ' = ' + 'json[' + "'" + key + "'] != null ? " + subClassName + '.fromJson(json[' + "'" + key + "']) : null;\n";
                        break;
                    }
                    case SFValueType._Array: {
                        if (value.length != 0) {
                            const v1Info = new SFValue(value[0]);
                            if (v1Info.type == SFValueType._Dictionary) {
                                const subClassName = this.makeClassName(key);
                                result += '     if (json[' + "'" + key + "'] != null) {\n";
                                result += '        ' + key + ' = List<' + subClassName + '>();\n';
                                result += '        json[' + "'" + key + "'].forEach((v) {\n"
                                result += '          ' + key + '.add(' + subClassName + '.fromJson(v));\n';
                                result += '        });\n'
                                result += '     }\n'
                            }else {
                                result += '      ' + key + ' = json[' + "'" + key + "'];\n";        
                            }
                        }else {
                            result += '      ' + key + ' = json[' + "'" + key + "'];\n";
                        }
                        break;
                    }
                    default:
                        result += '      ' + key + ' = json[' + "'" + key + "'];\n";
                        break;
                }
            }
        }
        result += '\n   }\n'
        result += '\n    Map<String, dynamic> toJson() {\n';  
        result += '     final Map<String, dynamic> data = new Map<String, dynamic>();\n';   
        for (const key in json_object) {
            if (json_object.hasOwnProperty(key)) {
                const value = json_object[key];
                const valueInfo = new SFValue(value);
                switch (valueInfo.type) {
                    case SFValueType._Dictionary:
                        result += '     if(this.' + key + ' != null) {\n';
                        result += '      data[' + "'" + key + "'] = this." + key + '.toJson();\n';
                        result += '     }\n';
                        break;
                    case SFValueType._Array:
                        if (value.length != 0) {
                            const v1Info = new SFValue(value[0]);
                            if (v1Info.type == SFValueType._Dictionary) {
                                result += '     if (this.' + key + ' != null) {\n';
                                result += '      data[' + "'" + key + "'] = this." + key + '.map((v) => v.toJson()).toList();\n';
                                result += '     }\n';
                            }else {
                                result += '     data[' + "'" + key + "'] = this." + key + ';\n';
                            }
                        }else {
                            result += '     data[' + "'" + key + "'] = this." + key + ';\n';
                        }
                        break;
                    default:
                        result += '     data[' + "'" + key + "'] = this." + key + ';\n';
                        break;
                }
            }
        }
        result += '     return data;\n';
        result += '   }\n'
        return result;
    }
    return '';
};

SFJsonParser.prototype.startParser = function(json) {
    if (json.length > 0) {
        let json_object = JSON.parse(json);
        if (json_object) {
            switch (this.type) {
                case SFParserLanguage.OC:
                    this.classHeader = this.makeFileRightText();
                    break;
                default:
                    break;
            }
            this.classImplementation = this.makeFileRightText();
            let content = this.makeClassBeginTxt(this.rootClassName);
            content += this.executeParseEngine(json_object, '');
            if (this.type == SFParserLanguage.Dart) {
                content += this.makeDartCreateFunc(json_object);
            }
            switch (this.type) {
                case SFParserLanguage.Java:
                    if (this.isExistArray) {
                        this.classImplementation = 'package ;\n\
import java.util.ArrayList;\n\
import java.util.List;\n' + this.classImplementation;
                    }else {
                        this.classImplementation = 'package ;\n' + this.classImplementation;
                    }
                    break;
                case SFParserLanguage.SwiftSexyJson:
                case SFParserLanguage.SwiftSexyJsonClass:
                    this.classImplementation = 'import SexyJson\n' + this.classImplementation;
                    break;
                default:
                    break;
            }
            content += this.makeClassEndTxt();
            content += '\n\n\n\n';
            this.addDidParsedContent(content);
        }
    }else {
        console.log('json string not empty');
    }
    return [this.classHeader, this.classImplementation];
};

SFJsonParser.prototype.makeFileRightText = function() {
    let date = new Date();
    let year = date.getFullYear();
    let generatedDate = date.toLocaleString();
    return '\n\n/**\n  * Copyright ' + year + ' Lurich\n  * Auto-generated:' + generatedDate + '\n  *\n' + '  * @author 小富\n' + '  * @简书 https://www.jianshu.com/u/b90f7dbcae6d\n' + '  * @github https://github.com/xiaofu666\n' + '  */\n\n\n';
};

SFJsonParser.prototype.autoSexyJsonMapAlign = function (content) {
    let new_content = '';
    if (content !== void 0) {
        const rows = content.split('\n');
        let maxLen = 0;
        rows.forEach((row) => {
            "use strict";
           const index = row.indexOf('<<<');
            if (index !== -1) {
                maxLen = Math.max(index, maxLen);
            }
        });
        rows.forEach((row) => {
            "use strict";
            const rowindex = row.indexOf('<<<');
            if (rowindex !== -1 && rowindex < maxLen) {
                const dindex = maxLen - rowindex;
                let blank = '';
                for (let i = 0; i < dindex; i++) {
                    blank += ' ';
                }
                new_content += row.substring(0, rowindex);
                new_content += blank;
                new_content += row.substring(rowindex);
                new_content += '\n';
            }else {
                new_content += row;
                new_content += '\n';
            }
        });
    }
    return new_content;
};
