const AuditLogService = require('./../../src/service/AuditLogService');
const auditLogService = new AuditLogService();

describe('AuditLogService.difference', () => {
    it('expect blank when input is same', () => {
        const from = {'key1': 'value1', 'key2': 'value2'};
        const to = {'key1': 'value1', 'key2': 'value2'};
        const diff = auditLogService.difference(to, from);
        expect(diff).toEqual({});
    });
    it('expect diff when content is different', () => {
        const from = {'key1': 'value1', 'key2': 'value2'};
        const to = {'key1': 'valueX', 'key2': 'value2'};
        const diff = auditLogService.difference(to, from);
        expect(diff).toEqual({'key1': 'valueX'});
    });
    it('expect diff when content is different multiple', () => {
        const from = {'key1': 'value1', 'key2': 'value2'};
        const to = {'key1': 'valueX', 'key2': 'valueY'};
        const diff = auditLogService.difference(to, from);
        expect(diff).toEqual({'key1': 'valueX', 'key2': 'valueY'});
    });
    it('expect diff when more keys are present', () => {
        const from = {'key1': 'value1', 'key2': 'value2'};
        const to = {'key1': 'value1', 'key2': 'value2', 'key3': 'value3'};
        const diff = auditLogService.difference(to, from);
        expect(diff).toEqual({'key3': 'value3'});
    });
    it('expect blank when less keys are present', () => {
        const from = {'key1': 'value1', 'key2': 'value2', 'key3': 'value3'};
        const to = {'key1': 'value1', 'key2': 'value2'};
        const diff = auditLogService.difference(to, from);
        expect(diff).toEqual({});
    });
});
